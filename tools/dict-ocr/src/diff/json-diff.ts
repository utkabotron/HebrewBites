import { compareHebrew, compareText, normalizeForId } from './normalize-hebrew.js';
import type { AlphabeticalEntry, AlphabeticalPage } from '../schemas/alphabetical.js';
import type {
  VerbExamplesEntry,
  VerbExamplesPage,
} from '../schemas/verb-examples.js';

export interface FieldCheck {
  field: string;
  expected: unknown;
  actual: unknown;
  status: 'match' | 'normalized' | 'mismatch' | 'missing';
}

export interface EntryDiff {
  id: string;
  status: 'matched' | 'missing-from-llm' | 'hallucination';
  expected?: unknown;
  actual?: unknown;
  fields: FieldCheck[];
}

export interface PageDiff {
  type: string;
  total_gt_entries: number;
  matched_entries: number;
  coverage: number;
  field_accuracy: Record<string, { strict: number; normalized: number; total: number }>;
  hebrew_with_nikkud_accuracy: number;
  hebrew_normalized_accuracy: number;
  hallucinations: number;
  missing: number;
  structure_errors: number;
  entries: EntryDiff[];
}

interface HebrewStat {
  strict: number;
  normalized: number;
  total: number;
}

function addField(
  stats: Record<string, { strict: number; normalized: number; total: number }>,
  field: string,
  ok: boolean,
  okNormalized: boolean,
) {
  if (!stats[field]) stats[field] = { strict: 0, normalized: 0, total: 0 };
  stats[field].total += 1;
  if (ok) stats[field].strict += 1;
  if (okNormalized) stats[field].normalized += 1;
}

function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 10000) / 100;
}

// ────────────────────────────────────────────────────────────────────────────────
// alphabetical
// ────────────────────────────────────────────────────────────────────────────────

export function diffAlphabetical(
  llm: AlphabeticalPage,
  gt: AlphabeticalPage,
): PageDiff {
  const gtById = new Map<string, AlphabeticalEntry>();
  for (const e of gt.entries) {
    gtById.set(normalizeForId(e.headword_he_normalized || e.headword_he), e);
  }

  const llmById = new Map<string, AlphabeticalEntry>();
  for (const e of llm.entries) {
    llmById.set(normalizeForId(e.headword_he_normalized || e.headword_he), e);
  }

  const fieldStats: Record<string, { strict: number; normalized: number; total: number }> = {};
  const hebrewStat: HebrewStat = { strict: 0, normalized: 0, total: 0 };
  const entriesDiff: EntryDiff[] = [];

  for (const [id, expected] of gtById) {
    const actual = llmById.get(id);
    if (!actual) {
      entriesDiff.push({
        id,
        status: 'missing-from-llm',
        expected,
        fields: [],
      });
      continue;
    }

    const fields: FieldCheck[] = [];

    // headword_he (Hebrew, with nikkud)
    {
      const eq = compareHebrew(expected.headword_he, actual.headword_he);
      addField(fieldStats, 'headword_he', eq.strict, eq.normalized);
      hebrewStat.total += 1;
      if (eq.strict) hebrewStat.strict += 1;
      if (eq.normalized) hebrewStat.normalized += 1;
      fields.push({
        field: 'headword_he',
        expected: expected.headword_he,
        actual: actual.headword_he,
        status: eq.strict ? 'match' : eq.normalized ? 'normalized' : 'mismatch',
      });
    }

    // grammar_tag
    {
      const e = expected.grammar_tag ?? '';
      const a = actual.grammar_tag ?? '';
      const ok = e === a;
      addField(fieldStats, 'grammar_tag', ok, ok);
      fields.push({
        field: 'grammar_tag',
        expected: e,
        actual: a,
        status: ok ? 'match' : 'mismatch',
      });
    }

    // translations: compare as sets after case/whitespace normalization
    {
      const e = new Set(expected.translations.map((t) => t.trim().toLowerCase()));
      const a = new Set(actual.translations.map((t) => t.trim().toLowerCase()));
      const intersection = [...e].filter((t) => a.has(t)).length;
      const union = new Set([...e, ...a]).size;
      const ok = e.size === a.size && intersection === e.size;
      const partial = intersection > 0;
      addField(fieldStats, 'translations', ok, ok || partial);
      fields.push({
        field: 'translations',
        expected: expected.translations,
        actual: actual.translations,
        status: ok ? 'match' : partial ? 'normalized' : 'mismatch',
      });
    }

    // notes_italic: same set logic
    {
      const e = new Set(expected.notes_italic.map((t) => t.trim().toLowerCase()));
      const a = new Set(actual.notes_italic.map((t) => t.trim().toLowerCase()));
      const ok = e.size === a.size && [...e].every((t) => a.has(t));
      addField(fieldStats, 'notes_italic', ok, ok);
      fields.push({
        field: 'notes_italic',
        expected: expected.notes_italic,
        actual: actual.notes_italic,
        status: ok ? 'match' : 'mismatch',
      });
    }

    // collocations: count + Hebrew accuracy on the first overlapping items
    {
      const eItems = expected.collocations;
      const aItems = actual.collocations;
      let strict = 0;
      let normalized = 0;
      const min = Math.min(eItems.length, aItems.length);
      for (let i = 0; i < min; i++) {
        const ee = eItems[i]!;
        const aa = aItems[i]!;
        const heEq = compareHebrew(ee.he, aa.he);
        const ruEq = compareText(ee.translation, aa.translation);
        hebrewStat.total += 1;
        if (heEq.strict) hebrewStat.strict += 1;
        if (heEq.normalized) hebrewStat.normalized += 1;
        if (heEq.strict && ruEq) strict += 1;
        if (heEq.normalized && ruEq) normalized += 1;
      }
      const ok = eItems.length === aItems.length && strict === eItems.length;
      const partial = ok || (eItems.length === aItems.length && normalized === eItems.length);
      addField(fieldStats, 'collocations', ok, partial);
      fields.push({
        field: 'collocations',
        expected: eItems,
        actual: aItems,
        status: ok ? 'match' : partial ? 'normalized' : 'mismatch',
      });
    }

    entriesDiff.push({
      id,
      status: 'matched',
      expected,
      actual,
      fields,
    });
  }

  // Hallucinations: LLM entries within the first N positions whose id isn't in GT.
  // We use the first `gt.entries.length` LLM entries as the comparable window.
  const window = llm.entries.slice(0, gt.entries.length);
  let hallucinations = 0;
  for (const e of window) {
    const id = normalizeForId(e.headword_he_normalized || e.headword_he);
    if (!gtById.has(id)) {
      hallucinations += 1;
      entriesDiff.push({
        id,
        status: 'hallucination',
        actual: e,
        fields: [],
      });
    }
  }

  const matched = entriesDiff.filter((d) => d.status === 'matched').length;
  const missing = entriesDiff.filter((d) => d.status === 'missing-from-llm').length;

  return {
    type: 'alphabetical',
    total_gt_entries: gt.entries.length,
    matched_entries: matched,
    coverage: pct(matched, gt.entries.length),
    field_accuracy: fieldStats,
    hebrew_with_nikkud_accuracy: pct(hebrewStat.strict, hebrewStat.total),
    hebrew_normalized_accuracy: pct(hebrewStat.normalized, hebrewStat.total),
    hallucinations,
    missing,
    structure_errors: 0,
    entries: entriesDiff,
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// verb-examples
// ────────────────────────────────────────────────────────────────────────────────

export function diffVerbExamples(
  llm: VerbExamplesPage,
  gt: VerbExamplesPage,
): PageDiff {
  const idOf = (e: VerbExamplesEntry) =>
    `${normalizeForId(e.headword_he_normalized || e.headword_he)}|${e.conjugation_pattern.trim()}`;

  const gtById = new Map<string, VerbExamplesEntry>();
  for (const e of gt.entries) gtById.set(idOf(e), e);

  const llmById = new Map<string, VerbExamplesEntry>();
  for (const e of llm.entries) llmById.set(idOf(e), e);

  const fieldStats: Record<string, { strict: number; normalized: number; total: number }> = {};
  const hebrewStat: HebrewStat = { strict: 0, normalized: 0, total: 0 };
  const entriesDiff: EntryDiff[] = [];
  let structureErrors = 0;

  for (const [id, expected] of gtById) {
    const actual = llmById.get(id);
    if (!actual) {
      entriesDiff.push({ id, status: 'missing-from-llm', expected, fields: [] });
      continue;
    }

    const fields: FieldCheck[] = [];

    // headword_he
    {
      const eq = compareHebrew(expected.headword_he, actual.headword_he);
      addField(fieldStats, 'headword_he', eq.strict, eq.normalized);
      hebrewStat.total += 1;
      if (eq.strict) hebrewStat.strict += 1;
      if (eq.normalized) hebrewStat.normalized += 1;
      fields.push({
        field: 'headword_he',
        expected: expected.headword_he,
        actual: actual.headword_he,
        status: eq.strict ? 'match' : eq.normalized ? 'normalized' : 'mismatch',
      });
    }

    // headword_translation_ru
    {
      const ok = compareText(expected.headword_translation_ru, actual.headword_translation_ru);
      addField(fieldStats, 'headword_translation_ru', ok, ok);
      fields.push({
        field: 'headword_translation_ru',
        expected: expected.headword_translation_ru,
        actual: actual.headword_translation_ru,
        status: ok ? 'match' : 'mismatch',
      });
    }

    // conjugation_pattern (binyan)
    {
      const e = expected.conjugation_pattern.trim();
      const a = actual.conjugation_pattern.trim();
      const ok = e === a;
      addField(fieldStats, 'conjugation_pattern', ok, ok);
      fields.push({
        field: 'conjugation_pattern',
        expected: e,
        actual: a,
        status: ok ? 'match' : 'mismatch',
      });
    }

    // examples — row-by-row, parallel alignment is key
    {
      const eExs = expected.examples;
      const aExs = actual.examples;
      if (eExs.length !== aExs.length) {
        structureErrors += 1;
      }
      const min = Math.min(eExs.length, aExs.length);
      let strictRows = 0;
      let normalizedRows = 0;
      for (let i = 0; i < min; i++) {
        const ee = eExs[i]!;
        const aa = aExs[i]!;
        const heEq = compareHebrew(ee.he, aa.he);
        const ruOk = compareText(ee.ru, aa.ru);
        const trOk = compareText(ee.translit, aa.translit);
        hebrewStat.total += 1;
        if (heEq.strict) hebrewStat.strict += 1;
        if (heEq.normalized) hebrewStat.normalized += 1;
        if (heEq.strict && ruOk && trOk) strictRows += 1;
        if (heEq.normalized && ruOk && trOk) normalizedRows += 1;
      }
      const ok = eExs.length === aExs.length && strictRows === eExs.length;
      const partial = eExs.length === aExs.length && normalizedRows === eExs.length;
      addField(fieldStats, 'examples', ok, ok || partial);
      fields.push({
        field: 'examples',
        expected: eExs,
        actual: aExs,
        status: ok ? 'match' : partial ? 'normalized' : 'mismatch',
      });
    }

    entriesDiff.push({ id, status: 'matched', expected, actual, fields });
  }

  const window = llm.entries.slice(0, gt.entries.length);
  let hallucinations = 0;
  for (const e of window) {
    if (!gtById.has(idOf(e))) {
      hallucinations += 1;
      entriesDiff.push({ id: idOf(e), status: 'hallucination', actual: e, fields: [] });
    }
  }

  const matched = entriesDiff.filter((d) => d.status === 'matched').length;
  const missing = entriesDiff.filter((d) => d.status === 'missing-from-llm').length;

  return {
    type: 'verb-examples',
    total_gt_entries: gt.entries.length,
    matched_entries: matched,
    coverage: pct(matched, gt.entries.length),
    field_accuracy: fieldStats,
    hebrew_with_nikkud_accuracy: pct(hebrewStat.strict, hebrewStat.total),
    hebrew_normalized_accuracy: pct(hebrewStat.normalized, hebrewStat.total),
    hallucinations,
    missing,
    structure_errors: structureErrors,
    entries: entriesDiff,
  };
}
