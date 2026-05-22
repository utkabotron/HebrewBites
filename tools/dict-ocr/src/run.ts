import 'dotenv/config';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import type { PageJob, PageType, RunConfig } from './types.js';

import {
  AlphabeticalPageSchema,
  alphabeticalResponseSchema,
} from './schemas/alphabetical.js';
import {
  ConjugationPageSchema,
  conjugationResponseSchema,
} from './schemas/conjugation.js';
import {
  VerbExamplesPageSchema,
  verbExamplesResponseSchema,
} from './schemas/verb-examples.js';

import { renderPdfPage } from './extractors/pdf-to-image.js';
import { geminiExtract } from './extractors/gemini.js';

import { diffAlphabetical, diffVerbExamples } from './diff/json-diff.js';
import { diffConjugation, parseConjugationMarkdown } from './diff/table-diff.js';
import type { PageDiff } from './diff/json-diff.js';
import { renderPageReport, renderSummary } from './reports/markdown.js';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), '..');

const PAGES: PageJob[] = [
  {
    type: 'alphabetical',
    pdf: 'fixtures/pdfs/CCF_000567.pdf',
    page: 1,
    groundTruth: 'fixtures/ground-truth/alphabetical.json',
  },
  {
    type: 'conjugation',
    pdf: 'fixtures/pdfs/CCF_000569.pdf',
    page: 1,
    groundTruth: 'fixtures/ground-truth/conjugation.md',
  },
  {
    type: 'verb-examples',
    pdf: 'fixtures/pdfs/CCF_000570.pdf',
    page: 1,
    groundTruth: 'fixtures/ground-truth/verb-examples.json',
  },
];

function loadConfig(): RunConfig {
  const apiKey = process.env.GEMINI_API_KEY ?? '';
  return {
    geminiApiKey: apiKey,
    model: process.env.LLM_MODEL ?? 'gemini-3-flash-preview',
    zoomLevel: Number(process.env.PDF_ZOOM_LEVEL ?? '2.0'),
    maxImageSize: Number(process.env.PDF_MAX_IMAGE_SIZE ?? '2048'),
    useNativePdf: (process.env.GEMINI_USE_NATIVE_PDF ?? 'false').toLowerCase() === 'true',
    maxRetries: Number(process.env.GEMINI_MAX_RETRIES ?? '3'),
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS ?? '120000'),
  };
}

function readPromptFor(type: PageType): string {
  return readFileSync(resolve(ROOT, `src/prompts/${type}.md`), 'utf8');
}

function schemaFor(type: PageType): unknown {
  switch (type) {
    case 'alphabetical':
      return alphabeticalResponseSchema;
    case 'conjugation':
      return conjugationResponseSchema;
    case 'verb-examples':
      return verbExamplesResponseSchema;
  }
}

function loadGroundTruth(type: PageType, gtPath: string): unknown {
  if (type === 'conjugation') {
    return parseConjugationMarkdown(gtPath);
  }
  const json = JSON.parse(readFileSync(gtPath, 'utf8'));
  if (type === 'alphabetical') return AlphabeticalPageSchema.parse(json);
  if (type === 'verb-examples') return VerbExamplesPageSchema.parse(json);
  throw new Error(`Unknown type: ${type}`);
}

function diffFor(type: PageType, llm: unknown, gt: unknown): PageDiff {
  if (type === 'alphabetical') {
    const llmParsed = AlphabeticalPageSchema.parse(llm);
    return diffAlphabetical(llmParsed, gt as ReturnType<typeof AlphabeticalPageSchema.parse>);
  }
  if (type === 'conjugation') {
    const llmParsed = ConjugationPageSchema.parse(llm);
    return diffConjugation(llmParsed, gt as ReturnType<typeof ConjugationPageSchema.parse>);
  }
  if (type === 'verb-examples') {
    const llmParsed = VerbExamplesPageSchema.parse(llm);
    return diffVerbExamples(llmParsed, gt as ReturnType<typeof VerbExamplesPageSchema.parse>);
  }
  throw new Error(`Unknown type: ${type}`);
}

async function runOne(job: PageJob, config: RunConfig): Promise<PageDiff> {
  const pdfPath = resolve(ROOT, job.pdf);
  const gtPath = resolve(ROOT, job.groundTruth);

  console.log(`\n=== ${job.type} ===`);
  console.log(`PDF: ${pdfPath}  page ${job.page}`);

  let imagePath: string | undefined;
  if (!config.useNativePdf) {
    const outPng = resolve(ROOT, `fixtures/images/${job.type}-p${job.page}.png`);
    console.log(`[render] PDF page → PNG @ zoom ${config.zoomLevel}x`);
    imagePath = await renderPdfPage({
      pdfPath,
      pageNumber: job.page,
      outPath: outPng,
      zoomLevel: config.zoomLevel,
      maxImageSize: config.maxImageSize,
    });
  } else {
    console.log('[render] sending PDF natively to Gemini');
  }

  const prompt = readPromptFor(job.type);
  const responseSchema = schemaFor(job.type);

  console.log(`[gemini] model=${config.model}`);
  const llmJson = await geminiExtract<unknown>({
    imagePath,
    pdfPath: config.useNativePdf ? pdfPath : undefined,
    prompt,
    responseSchema,
    config,
  });

  const extractionsDir = resolve(ROOT, 'output/extractions');
  mkdirSync(extractionsDir, { recursive: true });
  writeFileSync(
    resolve(extractionsDir, `${job.type}.json`),
    JSON.stringify(llmJson, null, 2),
    'utf8',
  );

  console.log(`[gt] loading ${gtPath}`);
  const gt = loadGroundTruth(job.type, gtPath);

  console.log(`[diff] computing metrics`);
  const diff = diffFor(job.type, llmJson, gt);

  const reportsDir = resolve(ROOT, 'output/reports');
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(resolve(reportsDir, `${job.type}.md`), renderPageReport(diff), 'utf8');

  console.log(
    `[done] coverage=${diff.coverage}% he-nikkud=${diff.hebrew_with_nikkud_accuracy}% he-norm=${diff.hebrew_normalized_accuracy}% hallucinations=${diff.hallucinations} missing=${diff.missing}`,
  );

  return diff;
}

async function main() {
  const config = loadConfig();

  if (!existsSync(resolve(ROOT, '.env'))) {
    console.warn(
      '[warn] tools/dict-ocr/.env not found — using process env only. See .env.example.',
    );
  }

  // Filter by --type=<name> CLI arg (positional).
  const filterArg = process.argv.slice(2).find((a) => !a.startsWith('-'));
  const jobs = filterArg ? PAGES.filter((p) => p.type === filterArg) : PAGES;
  if (filterArg && jobs.length === 0) {
    throw new Error(
      `No job matches --type=${filterArg}. Allowed: ${PAGES.map((p) => p.type).join(', ')}`,
    );
  }

  const diffs: PageDiff[] = [];
  for (const job of jobs) {
    try {
      const d = await runOne(job, config);
      diffs.push(d);
    } catch (err) {
      console.error(`[error] ${job.type}: ${err instanceof Error ? err.message : err}`);
    }
  }

  if (diffs.length > 1) {
    const summaryPath = resolve(ROOT, 'output/reports/summary.md');
    writeFileSync(summaryPath, renderSummary(diffs), 'utf8');
    console.log(`\n[summary] ${summaryPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
