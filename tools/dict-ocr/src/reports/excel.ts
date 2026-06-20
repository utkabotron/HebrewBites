import ExcelJS from 'exceljs';

import type { AlphabeticalPage } from '../schemas/alphabetical.js';
import type { ConjugationPage } from '../schemas/conjugation.js';
import type { VerbExamplesPage } from '../schemas/verb-examples.js';
import type { PageDiff } from '../diff/json-diff.js';

export interface ExcelInput {
  alphabetical?: AlphabeticalPage;
  conjugation?: ConjugationPage;
  verbExamples?: VerbExamplesPage;
  diffs?: PageDiff[];
}

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFC4712B' },
};
const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
};

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  row.height = 22;
}

function addAutoFilter(ws: ExcelJS.Worksheet, rows: number, cols: number) {
  if (rows === 0 || cols === 0) return;
  const lastCol = String.fromCharCode(64 + cols);
  ws.autoFilter = { from: 'A1', to: `${lastCol}${rows + 1}` };
}

// ────────────────────────────────────────────────────────────────────────────────
// Summary sheet
// ────────────────────────────────────────────────────────────────────────────────

function writeSummary(wb: ExcelJS.Workbook, input: ExcelInput) {
  const ws = wb.addWorksheet('Summary');

  ws.columns = [
    { header: 'Page type', key: 'type', width: 18 },
    { header: 'Entries extracted', key: 'count', width: 18 },
    { header: 'GT entries', key: 'gt', width: 12 },
    { header: 'Coverage %', key: 'cov', width: 12 },
    { header: 'Hebrew (nikkud) %', key: 'henk', width: 18 },
    { header: 'Hebrew (normalized) %', key: 'henorm', width: 22 },
    { header: 'Hallucinations', key: 'hal', width: 16 },
    { header: 'Missing', key: 'mis', width: 12 },
    { header: 'Structure errors', key: 'struct', width: 18 },
  ];
  styleHeader(ws.getRow(1));

  const diffByType = new Map((input.diffs ?? []).map((d) => [d.type, d]));

  const rows: Array<[string, number, number, number, number, number, number, number, number]> = [];

  if (input.alphabetical) {
    const d = diffByType.get('alphabetical');
    rows.push([
      'alphabetical',
      input.alphabetical.entries.length,
      d?.total_gt_entries ?? 0,
      d?.coverage ?? 0,
      d?.hebrew_with_nikkud_accuracy ?? 0,
      d?.hebrew_normalized_accuracy ?? 0,
      d?.hallucinations ?? 0,
      d?.missing ?? 0,
      d?.structure_errors ?? 0,
    ]);
  }
  if (input.conjugation) {
    const d = diffByType.get('conjugation');
    rows.push([
      'conjugation',
      input.conjugation.entries.length,
      d?.total_gt_entries ?? 0,
      d?.coverage ?? 0,
      d?.hebrew_with_nikkud_accuracy ?? 0,
      d?.hebrew_normalized_accuracy ?? 0,
      d?.hallucinations ?? 0,
      d?.missing ?? 0,
      d?.structure_errors ?? 0,
    ]);
  }
  if (input.verbExamples) {
    const d = diffByType.get('verb-examples');
    rows.push([
      'verb-examples',
      input.verbExamples.entries.length,
      d?.total_gt_entries ?? 0,
      d?.coverage ?? 0,
      d?.hebrew_with_nikkud_accuracy ?? 0,
      d?.hebrew_normalized_accuracy ?? 0,
      d?.hallucinations ?? 0,
      d?.missing ?? 0,
      d?.structure_errors ?? 0,
    ]);
  }
  for (const r of rows) ws.addRow(r);
  addAutoFilter(ws, rows.length, 9);
}

// ────────────────────────────────────────────────────────────────────────────────
// Alphabetical sheet — one row per entry
// ────────────────────────────────────────────────────────────────────────────────

function writeAlphabetical(wb: ExcelJS.Workbook, page: AlphabeticalPage) {
  const ws = wb.addWorksheet('Alphabetical', { views: [{ rightToLeft: false }] });

  ws.columns = [
    { header: '#', key: 'i', width: 5 },
    { header: 'Headword (nikkud)', key: 'he', width: 22 },
    { header: 'Headword (no nikkud)', key: 'he_n', width: 22 },
    { header: 'Grammar', key: 'g', width: 10 },
    { header: 'Translations', key: 'tr', width: 50 },
    { header: 'Italic notes', key: 'notes', width: 25 },
    { header: 'Collocations (he → ru)', key: 'col', width: 60 },
  ];
  styleHeader(ws.getRow(1));

  page.entries.forEach((e, i) => {
    const collocations = e.collocations
      .map((c) => `${c.he} → ${c.translation}`)
      .join('\n');
    const row = ws.addRow([
      i + 1,
      e.headword_he,
      e.headword_he_normalized,
      e.grammar_tag ?? '',
      e.translations.join('; '),
      e.notes_italic.join('; '),
      collocations,
    ]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(2).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(7).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  });
  ws.getColumn(2).font = { name: 'David CLM' };
  ws.getColumn(3).font = { name: 'David CLM' };
  addAutoFilter(ws, page.entries.length, 7);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Conjugation sheet — one row per (verb, tense, person)
// ────────────────────────────────────────────────────────────────────────────────

function writeConjugation(wb: ExcelJS.Workbook, page: ConjugationPage) {
  const ws = wb.addWorksheet('Conjugation');

  ws.columns = [
    { header: 'Root', key: 'root', width: 10 },
    { header: 'Binyan', key: 'binyan', width: 10 },
    { header: 'Infinitive (he)', key: 'inf', width: 16 },
    { header: 'Infinitive (translit)', key: 'inf_t', width: 18 },
    { header: 'Gerund (he)', key: 'ger', width: 14 },
    { header: 'Gerund (translit)', key: 'ger_t', width: 16 },
    { header: 'Tense', key: 'tense', width: 11 },
    { header: 'Person', key: 'p', width: 10 },
    { header: 'Form (he)', key: 'he', width: 20 },
    { header: 'Translit', key: 'tr', width: 20 },
  ];
  styleHeader(ws.getRow(1));

  let rowCount = 0;
  for (const e of page.entries) {
    const tenses = [
      ['past', e.tenses.past],
      ['present', e.tenses.present],
      ['future', e.tenses.future],
      ['imperative', e.tenses.imperative],
    ] as const;
    for (const [tense, forms] of tenses) {
      for (const f of forms) {
        ws.addRow([
          e.root,
          e.binyan,
          e.infinitive_he,
          e.infinitive_translit,
          e.gerund_he ?? '',
          e.gerund_translit ?? '',
          tense,
          f.person,
          f.he,
          f.translit,
        ]);
        rowCount += 1;
      }
    }
  }

  ws.getColumn(3).alignment = { horizontal: 'right' };
  ws.getColumn(5).alignment = { horizontal: 'right' };
  ws.getColumn(8).alignment = { horizontal: 'right' };
  ws.getColumn(9).alignment = { horizontal: 'right' };

  addAutoFilter(ws, rowCount, 10);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Verb examples sheet — one row per (verb, example index)
// ────────────────────────────────────────────────────────────────────────────────

function writeVerbExamples(wb: ExcelJS.Workbook, page: VerbExamplesPage) {
  const ws = wb.addWorksheet('Verb examples');

  ws.columns = [
    { header: 'Headword (he)', key: 'h_he', width: 18 },
    { header: 'Headword (no nikkud)', key: 'h_n', width: 18 },
    { header: 'Translation (ru)', key: 'h_ru', width: 30 },
    { header: 'Binyan', key: 'b', width: 10 },
    { header: 'Example #', key: 'i', width: 10 },
    { header: 'Russian', key: 'ru', width: 50 },
    { header: 'Transliteration', key: 'tr', width: 40 },
    { header: 'Hebrew', key: 'he', width: 50 },
  ];
  styleHeader(ws.getRow(1));

  let rowCount = 0;
  for (const e of page.entries) {
    e.examples.forEach((ex, i) => {
      const row = ws.addRow([
        e.headword_he,
        e.headword_he_normalized,
        e.headword_translation_ru,
        e.conjugation_pattern,
        i + 1,
        ex.ru,
        ex.translit,
        ex.he,
      ]);
      row.alignment = { vertical: 'top', wrapText: true };
      row.getCell(1).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
      row.getCell(8).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
      rowCount += 1;
    });
  }
  addAutoFilter(ws, rowCount, 8);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Entrypoint
// ────────────────────────────────────────────────────────────────────────────────

export async function writeWorkbook(outPath: string, input: ExcelInput): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'dict-ocr';
  wb.created = new Date();

  writeSummary(wb, input);
  if (input.alphabetical) writeAlphabetical(wb, input.alphabetical);
  if (input.conjugation) writeConjugation(wb, input.conjugation);
  if (input.verbExamples) writeVerbExamples(wb, input.verbExamples);

  await wb.xlsx.writeFile(outPath);
}
