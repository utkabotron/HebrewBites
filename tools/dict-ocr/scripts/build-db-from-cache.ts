import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildCanonical } from '../src/db/build.js';
import { denormalize } from '../src/db/denormalize.js';
import { writeVocabularyWorkbook } from '../src/reports/excel-db.js';
import { AlphabeticalPageSchema } from '../src/schemas/alphabetical.js';
import { ConjugationPageSchema } from '../src/schemas/conjugation.js';
import { VerbExamplesPageSchema } from '../src/schemas/verb-examples.js';

function tryLoadJson(path: string): unknown | undefined {
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

async function main() {
  const root = resolve(import.meta.dirname!, '..');
  const extractionsDir = resolve(root, 'output/extractions');

  const alphaJson = tryLoadJson(resolve(extractionsDir, 'alphabetical.json'));
  const verbJson = tryLoadJson(resolve(extractionsDir, 'verb-examples.json'));
  const conjJson = tryLoadJson(resolve(extractionsDir, 'conjugation.json'));

  const alphabetical = alphaJson ? AlphabeticalPageSchema.parse(alphaJson) : undefined;
  const verbExamples = verbJson ? VerbExamplesPageSchema.parse(verbJson) : undefined;
  const conjugation = conjJson ? ConjugationPageSchema.parse(conjJson) : undefined;

  // Use file mtime for deterministic extracted_at (stable across re-runs).
  const mtimes = [
    resolve(extractionsDir, 'alphabetical.json'),
    resolve(extractionsDir, 'verb-examples.json'),
    resolve(extractionsDir, 'conjugation.json'),
  ]
    .filter(existsSync)
    .map((p) => statSync(p).mtime.getTime());
  const extracted_at = mtimes.length
    ? new Date(Math.max(...mtimes)).toISOString()
    : new Date().toISOString();

  const db = buildCanonical({ alphabetical, verbExamples, conjugation, meta: { extracted_at } });
  const cards = denormalize(db);

  const dbDir = resolve(root, 'output/db');
  mkdirSync(dbDir, { recursive: true });

  writeFileSync(resolve(dbDir, 'vocabulary.json'), JSON.stringify(db, null, 2), 'utf8');
  writeFileSync(resolve(dbDir, 'cards.json'), JSON.stringify(cards, null, 2), 'utf8');
  await writeVocabularyWorkbook(resolve(dbDir, 'vocabulary.xlsx'), db);

  console.log('words:', db.words.length);
  console.log('translations:', db.translations.length);
  console.log('collocations:', db.collocations.length);
  console.log('examples:', db.examples.length);
  console.log('conjugations:', db.conjugations.length);
  console.log('app cards:', cards.length);
  console.log('outputs:', dbDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
