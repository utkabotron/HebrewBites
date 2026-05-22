// Hebrew normalization utilities for diffing OCR output against ground truth.

// Nikkud + cantillation marks: U+0591..U+05C7.
const NIKKUD_RE = /[֑-ׇ]/g;

// Bidi / formatting controls that often slip into OCR output but aren't visible.
const BIDI_CONTROLS_RE = /[‌-‏‪-‮⁦-⁩﻿]/g;

// Map final letters to their non-final forms for "loose" identity matching.
const FINAL_TO_REGULAR: Record<string, string> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

/** Strip all nikkud / cantillation marks. */
export function stripNikkud(input: string): string {
  return input.normalize('NFC').replace(NIKKUD_RE, '');
}

/** Strip bidi / formatting control characters. */
export function stripBidi(input: string): string {
  return input.replace(BIDI_CONTROLS_RE, '');
}

/** Loose form for identity match — drop nikkud, bidi controls, finals, whitespace. */
export function normalizeForId(input: string): string {
  const noNikkud = stripNikkud(stripBidi(input));
  const noFinals = noNikkud
    .split('')
    .map((c) => FINAL_TO_REGULAR[c] ?? c)
    .join('');
  return noFinals.replace(/\s+/g, '').trim();
}

/** Strict comparison: NFC + bidi-control stripped + whitespace collapsed, nikkud preserved. */
export function strictKey(input: string): string {
  return stripBidi(input.normalize('NFC')).replace(/\s+/g, ' ').trim();
}

/** Normalized comparison: nikkud-insensitive but finals/whitespace preserved (trim). */
export function normalizedKey(input: string): string {
  return stripNikkud(stripBidi(input.normalize('NFC'))).replace(/\s+/g, ' ').trim();
}

/** Equality variants used by the diff layer. */
export interface HebrewEquality {
  strict: boolean;
  normalized: boolean;
}

export function compareHebrew(a: string, b: string): HebrewEquality {
  return {
    strict: strictKey(a) === strictKey(b),
    normalized: normalizedKey(a) === normalizedKey(b),
  };
}

/** For Russian / Latin / non-Hebrew strings — just trim + collapse whitespace + lowercase. */
export function compareText(a: string, b: string): boolean {
  return a.trim().replace(/\s+/g, ' ').toLowerCase() ===
    b.trim().replace(/\s+/g, ' ').toLowerCase();
}
