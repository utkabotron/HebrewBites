import ExcelJS from 'exceljs';

import type { CanonicalDb } from '../db/types.js';

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
  const lastCol = colLetter(cols);
  ws.autoFilter = { from: 'A1', to: `${lastCol}${rows + 1}` };
}

function colLetter(n: number): string {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// ────────────────────────────────────────────────────────────────────────────────
// Summary
// ────────────────────────────────────────────────────────────────────────────────

function writeSummary(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Summary');
  ws.columns = [
    { header: 'Metric', key: 'k', width: 30 },
    { header: 'Value', key: 'v', width: 30 },
  ];
  styleHeader(ws.getRow(1));

  const bySource = countBy(db.words, (w) => w.source_book);
  const byPos = countBy(db.words, (w) => w.pos);
  const byBinyan = countBy(
    db.words.filter((w) => w.binyan),
    (w) => w.binyan!,
  );
  const byLang = countBy(db.translations, (t) => t.lang);

  ws.addRow(['Extracted at', db.meta.extracted_at]);
  ws.addRow(['Model', db.meta.model]);
  ws.addRow(['Sources', db.meta.sources.join(', ')]);
  ws.addRow([]);
  ws.addRow(['Words (total)', db.words.length]);
  ws.addRow(['Translations (total)', db.translations.length]);
  ws.addRow(['Collocations (total)', db.collocations.length]);
  ws.addRow(['Examples (total)', db.examples.length]);
  ws.addRow(['Conjugations (total)', db.conjugations.length]);
  ws.addRow([]);
  ws.addRow(['Words by source']);
  for (const [k, v] of bySource) ws.addRow([`  ${k}`, v]);
  ws.addRow([]);
  ws.addRow(['Words by POS']);
  for (const [k, v] of byPos) ws.addRow([`  ${k}`, v]);
  ws.addRow([]);
  ws.addRow(['Verbs by binyan']);
  for (const [k, v] of byBinyan) ws.addRow([`  ${k}`, v]);
  ws.addRow([]);
  ws.addRow(['Translations by lang']);
  for (const [k, v] of byLang) ws.addRow([`  ${k}`, v]);

  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

function countBy<T, K>(arr: T[], key: (item: T) => K): Array<[K, number]> {
  const map = new Map<K, number>();
  for (const item of arr) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

// ────────────────────────────────────────────────────────────────────────────────
// Words
// ────────────────────────────────────────────────────────────────────────────────

function writeWords(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Words');
  ws.columns = [
    { header: 'ID', key: 'id', width: 16 },
    { header: 'Headword (nikkud)', key: 'he', width: 22 },
    { header: 'Clean', key: 'clean', width: 16 },
    { header: 'Translit', key: 'tr', width: 18 },
    { header: 'POS', key: 'pos', width: 10 },
    { header: 'POS raw', key: 'praw', width: 10 },
    { header: 'Binyan', key: 'b', width: 10 },
    { header: 'Sense', key: 's', width: 6 },
    { header: 'Notes', key: 'n', width: 30 },
    { header: 'Source', key: 'src', width: 16 },
    { header: 'Page', key: 'pg', width: 6 },
    { header: 'Pos#', key: 'pos#', width: 6 },
  ];
  styleHeader(ws.getRow(1));

  for (const w of db.words) {
    const row = ws.addRow([
      w.id,
      w.headword_he,
      w.headword_clean,
      w.transliteration ?? '',
      w.pos,
      w.pos_raw ?? '',
      w.binyan ?? '',
      w.sense_idx,
      w.notes.join('; '),
      w.source_book,
      w.source_page,
      w.source_position,
    ]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(2).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  }

  addAutoFilter(ws, db.words.length, 12);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Translations
// ────────────────────────────────────────────────────────────────────────────────

function writeTranslations(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Translations');
  ws.columns = [
    { header: 'Word ID', key: 'wid', width: 16 },
    { header: 'Lang', key: 'l', width: 6 },
    { header: 'Order', key: 'o', width: 6 },
    { header: 'Value', key: 'v', width: 60 },
    { header: 'Headword (preview)', key: 'hw', width: 22 },
  ];
  styleHeader(ws.getRow(1));

  const wordById = new Map(db.words.map((w) => [w.id, w]));

  for (const t of db.translations) {
    const w = wordById.get(t.word_id);
    const row = ws.addRow([t.word_id, t.lang, t.order_idx, t.value, w?.headword_he ?? '']);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(5).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  }

  addAutoFilter(ws, db.translations.length, 5);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Collocations
// ────────────────────────────────────────────────────────────────────────────────

function writeCollocations(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Collocations');
  ws.columns = [
    { header: 'ID', key: 'id', width: 16 },
    { header: 'Parent word', key: 'p', width: 16 },
    { header: 'Parent (preview)', key: 'pp', width: 18 },
    { header: 'Phrase (he)', key: 'he', width: 26 },
    { header: 'Phrase (clean)', key: 'c', width: 18 },
    { header: 'Translation', key: 't', width: 50 },
    { header: 'Lang', key: 'l', width: 6 },
  ];
  styleHeader(ws.getRow(1));

  const wordById = new Map(db.words.map((w) => [w.id, w]));

  for (const c of db.collocations) {
    const w = wordById.get(c.parent_word_id);
    const row = ws.addRow([
      c.id,
      c.parent_word_id,
      w?.headword_he ?? '',
      c.phrase_he,
      c.phrase_clean,
      c.translation,
      c.lang,
    ]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(4).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(5).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  }

  addAutoFilter(ws, db.collocations.length, 7);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Examples
// ────────────────────────────────────────────────────────────────────────────────

function writeExamples(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Examples');
  ws.columns = [
    { header: 'ID', key: 'id', width: 16 },
    { header: 'Word ID', key: 'w', width: 16 },
    { header: 'Word (preview)', key: 'wp', width: 18 },
    { header: 'Order', key: 'o', width: 6 },
    { header: 'Hebrew', key: 'he', width: 50 },
    { header: 'Translit', key: 'tr', width: 40 },
    { header: 'Russian', key: 'ru', width: 50 },
  ];
  styleHeader(ws.getRow(1));

  const wordById = new Map(db.words.map((w) => [w.id, w]));

  for (const e of db.examples) {
    const w = wordById.get(e.word_id);
    const row = ws.addRow([
      e.id,
      e.word_id,
      w?.headword_he ?? '',
      e.order_idx,
      e.sentence_he,
      e.sentence_translit,
      e.sentence_ru,
    ]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(5).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  }

  addAutoFilter(ws, db.examples.length, 7);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Conjugations
// ────────────────────────────────────────────────────────────────────────────────

function writeConjugations(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Conjugations');
  ws.columns = [
    { header: 'ID', key: 'id', width: 16 },
    { header: 'Word ID', key: 'w', width: 16 },
    { header: 'Word (preview)', key: 'wp', width: 18 },
    { header: 'Binyan', key: 'b', width: 10 },
    { header: 'Tense', key: 't', width: 12 },
    { header: 'Person', key: 'p', width: 8 },
    { header: 'Form (he)', key: 'he', width: 20 },
    { header: 'Translit', key: 'tr', width: 20 },
  ];
  styleHeader(ws.getRow(1));

  const wordById = new Map(db.words.map((w) => [w.id, w]));

  for (const c of db.conjugations) {
    const w = wordById.get(c.word_id);
    const row = ws.addRow([
      c.id,
      c.word_id,
      w?.headword_he ?? '',
      w?.binyan ?? '',
      c.tense,
      c.person,
      c.form_he,
      c.form_translit,
    ]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(3).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(6).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
    row.getCell(7).alignment = { vertical: 'top', wrapText: true, horizontal: 'right' };
  }

  addAutoFilter(ws, db.conjugations.length, 8);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Search index preview
// ────────────────────────────────────────────────────────────────────────────────

function writeSearchPreview(wb: ExcelJS.Workbook, db: CanonicalDb) {
  const ws = wb.addWorksheet('Search index preview');
  ws.columns = [
    { header: 'Search key', key: 'k', width: 22 },
    { header: 'Word ID', key: 'w', width: 16 },
    { header: 'Headword', key: 'h', width: 20 },
    { header: 'POS', key: 'p', width: 8 },
    { header: 'Primary translation', key: 't', width: 40 },
  ];
  styleHeader(ws.getRow(1));

  const translationsByWord = new Map<string, string>();
  for (const t of db.translations) {
    if (t.order_idx === 0 && !translationsByWord.has(t.word_id)) {
      translationsByWord.set(t.word_id, `${t.value} (${t.lang})`);
    }
  }

  const keys = db.words.slice(0, 100).map((w) => ({
    k: w.headword_clean,
    w: w.id,
    h: w.headword_he,
    p: w.pos,
    t: translationsByWord.get(w.id) ?? '',
  }));

  for (const k of keys) {
    const row = ws.addRow([k.k, k.w, k.h, k.p, k.t]);
    row.alignment = { vertical: 'top', wrapText: true };
    row.getCell(1).alignment = { vertical: 'top', horizontal: 'right' };
    row.getCell(3).alignment = { vertical: 'top', horizontal: 'right' };
  }

  addAutoFilter(ws, keys.length, 5);
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ────────────────────────────────────────────────────────────────────────────────
// Entrypoint
// ────────────────────────────────────────────────────────────────────────────────

export async function writeVocabularyWorkbook(outPath: string, db: CanonicalDb): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'dict-ocr';
  wb.created = new Date();

  writeSummary(wb, db);
  writeWords(wb, db);
  writeTranslations(wb, db);
  writeCollocations(wb, db);
  writeExamples(wb, db);
  writeConjugations(wb, db);
  writeSearchPreview(wb, db);

  await wb.xlsx.writeFile(outPath);
}
