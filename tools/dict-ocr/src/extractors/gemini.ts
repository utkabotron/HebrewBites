import { GoogleGenAI, type Part } from '@google/genai';
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import type { RunConfig } from '../types.js';

interface ExtractArgs {
  imagePath?: string;
  pdfPath?: string;
  prompt: string;
  responseSchema: unknown;
  config: RunConfig;
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fileToInlinePart(path: string): Part {
  const ext = extname(path).toLowerCase();
  const mimeType =
    ext === '.pdf'
      ? 'application/pdf'
      : ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : 'application/octet-stream';

  const data = readFileSync(path).toString('base64');
  return { inlineData: { data, mimeType } };
}

function isRetryable(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const anyErr = err as { status?: number; code?: number; message?: string };
  if (anyErr.status && RETRYABLE_STATUS.has(anyErr.status)) return true;
  if (anyErr.code && RETRYABLE_STATUS.has(anyErr.code)) return true;
  if (anyErr.message && /(429|500|502|503|504|timeout|ECONN)/i.test(anyErr.message))
    return true;
  return false;
}

/**
 * Send an image (or PDF, if `GEMINI_USE_NATIVE_PDF=true`) + prompt + JSON schema to Gemini,
 * and return the parsed JSON.
 *
 * Retries on 408/429/5xx with exponential backoff.
 */
export async function geminiExtract<T>(args: ExtractArgs): Promise<T> {
  const { prompt, responseSchema, config } = args;

  if (!config.geminiApiKey || config.geminiApiKey === 'your-gemini-api-key-here') {
    throw new Error(
      'GEMINI_API_KEY is empty or still the placeholder. Fill in tools/dict-ocr/.env.',
    );
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  const filePath = config.useNativePdf ? args.pdfPath : args.imagePath;
  if (!filePath) {
    throw new Error(
      `geminiExtract: ${config.useNativePdf ? 'pdfPath' : 'imagePath'} is required`,
    );
  }

  const contents = [
    { role: 'user' as const, parts: [fileToInlinePart(filePath), { text: prompt }] },
  ];

  let attempt = 0;
  let lastErr: unknown;

  while (attempt <= config.maxRetries) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      const response = await ai.models.generateContent({
        model: config.model,
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema as Record<string, unknown>,
          // Higher token budget — dictionary pages can be dense.
          maxOutputTokens: 16384,
          temperature: 0,
        },
        // @ts-expect-error — newer SDKs accept signal; ignore if not present.
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const text =
        response.text ??
        response.candidates?.[0]?.content?.parts
          ?.map((p) => ('text' in p ? p.text : ''))
          .join('') ??
        '';

      if (!text) {
        throw new Error('Gemini returned empty text');
      }

      return JSON.parse(text) as T;
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === config.maxRetries) {
        break;
      }
      const backoffMs = Math.min(30_000, 1000 * Math.pow(2, attempt));
      const message = err instanceof Error ? err.message : String(err);
      console.warn(
        `[gemini] retry ${attempt + 1}/${config.maxRetries} after ${backoffMs}ms: ${message}`,
      );
      await sleep(backoffMs);
      attempt++;
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error(`Gemini call failed: ${String(lastErr)}`);
}
