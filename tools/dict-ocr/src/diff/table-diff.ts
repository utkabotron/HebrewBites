import { readFileSync } from 'node:fs';
import { compareHebrew, compareText, normalizeForId } from './normalize-hebrew.js';
import type {
  ConjugationEntry,
  ConjugationPage,
} from '../schemas/conjugation.js';
import type { EntryDiff, FieldCheck, PageDiff } from './json-diff.js';

interface MdConjugationEntry {
  root: string;
  binyan: string;
  infinitive_he: string;
  infinitive_translit: string;
  gerund_he: string | null;
  gerund_translit: string | null;
  tenses: {
    past: Array<{ person: string; he: string; translit: string }>;
    present: Array<{ person: string; he: string; translit: string }>;
    future: Array<{ person: string; he: string; translit: string }>;
    imperative: Array<{ person: string; he: string; translit: string }>;
  };
}

/**
 * Parse a markdown ground-truth file describing one or more conjugation tables.
 *
 * Expected layout (per entry):
 *
 *   # ROOT BINYAN
 *   - infinitive_he: לִגְמֹר
 *   - infinitive_translit: ligmor
 *   - gerund_he: גְּמִירָה
 *   - gerund_translit: gmira
 *
 *   ## past
 *   | person | he         | translit |
 *   | ------ | ---------- | -------- |
 *   | אני    | גָּמַרְתִּי | gamarti  |
 *   ...
 *   ## present
 *   ...
 *   ## future
 *   ...
 *   ## imperative
 *   ...
 *
 * Multiple entries are separated by another top-level `# ...` header.
 */
export function parseConjugationMarkdown(mdPath: string): ConjugationPage {
  const raw = readFileSync(mdPath, 'utf8');

  // Strip comment lines starting with `<!--`
  const lines = raw
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith('<!--'));

  type TenseKey = 'past' | 'present' | 'future' | 'imperative';
  const entries: MdConjugationEntry[] = [];
  let current: MdConjugationEntry | null = null;
  let currentTense: TenseKey | null = null;

  const flush = () => {
    if (current) entries.push(current);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    const h1 = /^#\s+(.+)$/.exec(line);
    if (h1 && !line.startsWith('##')) {
      flush();
      const [root, binyan] = h1[1]!.trim().split(/\s+/);
      current = {
        root: root ?? '',
        binyan: binyan ?? '',
        infinitive_he: '',
        infinitive_translit: '',
        gerund_he: null,
        gerund_translit: null,
        tenses: { past: [], present: [], future: [], imperative: [] },
      };
      currentTense = null;
      continue;
    }

    if (!current) continue;

    const h2 = /^##\s+(past|present|future|imperative)\b/i.exec(line);
    if (h2) {
      currentTense = h2[1]!.toLowerCase() as TenseKey;
      continue;
    }

    // Metadata bullet line: "- key: value"
    const bullet = /^-\s+([\w_]+):\s*(.+)$/.exec(line);
    if (bullet && !currentTense) {
      const [, key, value] = bullet;
      const k = key as keyof MdConjugationEntry;
      const v = value!.trim() === '-' || value!.trim().toLowerCase() === 'null' ? null : value!.trim();
      if (k === 'infinitive_he') current.infinitive_he = v ?? '';
      else if (k === 'infinitive_translit') current.infinitive_translit = v ?? '';
      else if (k === 'gerund_he') current.gerund_he = v;
      else if (k === 'gerund_translit') current.gerund_translit = v;
      continue;
    }

    // Table row inside a tense block: "| person | he | translit |"
    if (currentTense && line.trim().startsWith('|')) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      // Skip header & separator rows.
      if (cells.length < 3) continue;
      if (/^-+$/.test(cells[0] ?? '')) continue;
      if (cells[0]?.toLowerCase() === 'person') continue;

      current.tenses[currentTense].push({
        person: cells[0] ?? '',
        he: cells[1] ?? '',
        translit: cells[2] ?? '',
      });
    }
  }
  flush();

  return {
    entries: entries.map((e) => ({
      root: e.root,
      binyan: e.binyan,
      infinitive_he: e.infinitive_he,
      infinitive_translit: e.infinitive_translit,
      gerund_he: e.gerund_he,
      gerund_translit: e.gerund_translit,
      tenses: {
        past: e.tenses.past.map((f) => ({ ...f, translation_ru: null })),
        present: e.tenses.present.map((f) => ({ ...f, translation_ru: null })),
        future: e.tenses.future.map((f) => ({ ...f, translation_ru: null })),
        imperative: e.tenses.imperative.map((f) => ({ ...f, translation_ru: null })),
      },
    })),
  };
}

function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 10000) / 100;
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

export function diffConjugation(
  llm: ConjugationPage,
  gt: ConjugationPage,
): PageDiff {
  const idOf = (e: ConjugationEntry) => `${e.root.trim()}|${e.binyan.trim()}`;

  const gtById = new Map<string, ConjugationEntry>();
  for (const e of gt.entries) gtById.set(idOf(e), e);

  const llmById = new Map<string, ConjugationEntry>();
  for (const e of llm.entries) llmById.set(idOf(e), e);

  const fieldStats: Record<string, { strict: number; normalized: number; total: number }> = {};
  let hebrewStrict = 0;
  let hebrewNormalized = 0;
  let hebrewTotal = 0;
  const entriesDiff: EntryDiff[] = [];
  let structureErrors = 0;

  const tenseKeys = ['past', 'present', 'future', 'imperative'] as const;

  for (const [id, expected] of gtById) {
    const actual = llmById.get(id);
    if (!actual) {
      entriesDiff.push({ id, status: 'missing-from-llm', expected, fields: [] });
      continue;
    }

    const fields: FieldCheck[] = [];

    // infinitive_he
    {
      const eq = compareHebrew(expected.infinitive_he, actual.infinitive_he);
      addField(fieldStats, 'infinitive_he', eq.strict, eq.normalized);
      hebrewTotal += 1;
      if (eq.strict) hebrewStrict += 1;
      if (eq.normalized) hebrewNormalized += 1;
      fields.push({
        field: 'infinitive_he',
        expected: expected.infinitive_he,
        actual: actual.infinitive_he,
        status: eq.strict ? 'match' : eq.normalized ? 'normalized' : 'mismatch',
      });
    }

    // gerund_he (if expected has one)
    if (expected.gerund_he) {
      const a = actual.gerund_he ?? '';
      const eq = compareHebrew(expected.gerund_he, a);
      addField(fieldStats, 'gerund_he', eq.strict, eq.normalized);
      hebrewTotal += 1;
      if (eq.strict) hebrewStrict += 1;
      if (eq.normalized) hebrewNormalized += 1;
      fields.push({
        field: 'gerund_he',
        expected: expected.gerund_he,
        actual: a,
        status: eq.strict ? 'match' : eq.normalized ? 'normalized' : 'mismatch',
      });
    }

    // Tense tables — per-cell comparison by person.
    for (const tense of tenseKeys) {
      const eRows = expected.tenses[tense];
      const aRows = actual.tenses[tense];
      const aByPerson = new Map(aRows.map((r) => [normalizeForId(r.person), r] as const));

      let cellStrict = 0;
      let cellNormalized = 0;
      let cellTotal = 0;
      const missingCells: string[] = [];

      for (const er of eRows) {
        cellTotal += 1;
        const ar = aByPerson.get(normalizeForId(er.person));
        if (!ar) {
          structureErrors += 1;
          missingCells.push(er.person);
          continue;
        }
        const heEq = compareHebrew(er.he, ar.he);
        const trOk = compareText(er.translit, ar.translit);
        hebrewTotal += 1;
        if (heEq.strict) hebrewStrict += 1;
        if (heEq.normalized) hebrewNormalized += 1;
        if (heEq.strict && trOk) cellStrict += 1;
        if (heEq.normalized && trOk) cellNormalized += 1;
      }

      const ok = missingCells.length === 0 && cellStrict === cellTotal;
      const partial = missingCells.length === 0 && cellNormalized === cellTotal;
      addField(fieldStats, `tenses.${tense}`, ok, ok || partial);
      fields.push({
        field: `tenses.${tense}`,
        expected: eRows,
        actual: aRows,
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
    type: 'conjugation',
    total_gt_entries: gt.entries.length,
    matched_entries: matched,
    coverage: pct(matched, gt.entries.length),
    field_accuracy: fieldStats,
    hebrew_with_nikkud_accuracy: pct(hebrewStrict, hebrewTotal),
    hebrew_normalized_accuracy: pct(hebrewNormalized, hebrewTotal),
    hallucinations,
    missing,
    structure_errors: structureErrors,
    entries: entriesDiff,
  };
}
