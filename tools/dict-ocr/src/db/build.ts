import type { AlphabeticalPage } from '../schemas/alphabetical.js';
import type { ConjugationPage } from '../schemas/conjugation.js';
import type { VerbExamplesPage } from '../schemas/verb-examples.js';

import { normalizeForId } from '../diff/normalize-hebrew.js';
import { collocationId, wordId } from './ids.js';
import { mapPos } from './pos-mapping.js';
import type { CanonicalDb, Collocation, Conjugation, DbMeta, Example, Translation, Word } from './types.js';
import { resolveConjugations, resolveVerbExamples } from './resolve.js';

export const SOURCE_ALPHABETICAL = 'CCF_000567';
export const SOURCE_CONJUGATION = 'CCF_000569';
export const SOURCE_VERB_EXAMPLES = 'CCF_000570';

export interface BuildInput {
  alphabetical?: AlphabeticalPage;
  conjugation?: ConjugationPage;
  verbExamples?: VerbExamplesPage;
  meta?: Partial<DbMeta>;
}

export function buildCanonical(input: BuildInput): CanonicalDb {
  const words: Word[] = [];
  const translations: Translation[] = [];
  const collocations: Collocation[] = [];
  const examples: Example[] = [];
  const conjugations: Conjugation[] = [];

  if (input.alphabetical) {
    buildFromAlphabetical(input.alphabetical, words, translations, collocations);
  }
  if (input.verbExamples) {
    resolveVerbExamples(input.verbExamples, words, translations, examples);
  }
  if (input.conjugation) {
    resolveConjugations(input.conjugation, words, conjugations);
  }

  const sources: string[] = [];
  if (input.alphabetical) sources.push(`${SOURCE_ALPHABETICAL} p.1`);
  if (input.conjugation) sources.push(`${SOURCE_CONJUGATION} p.1`);
  if (input.verbExamples) sources.push(`${SOURCE_VERB_EXAMPLES} p.1`);

  const meta: DbMeta = {
    extracted_at: input.meta?.extracted_at ?? new Date().toISOString(),
    model: input.meta?.model ?? process.env.LLM_MODEL ?? 'gemini-3-flash-preview',
    sources: input.meta?.sources ?? sources,
  };

  return { meta, words, translations, collocations, examples, conjugations };
}

function buildFromAlphabetical(
  page: AlphabeticalPage,
  words: Word[],
  translations: Translation[],
  collocations: Collocation[],
): void {
  const senseCount = new Map<string, number>();

  page.entries.forEach((entry, position) => {
    const clean = normalizeForId(entry.headword_he);
    const sense_idx = senseCount.get(clean) ?? 0;
    senseCount.set(clean, sense_idx + 1);

    const { pos } = mapPos(entry.grammar_tag);
    const id = wordId(clean, SOURCE_ALPHABETICAL, position);

    words.push({
      id,
      headword_he: entry.headword_he,
      headword_clean: clean,
      transliteration: null,
      pos,
      pos_raw: entry.grammar_tag,
      binyan: null,
      sense_idx,
      notes: entry.notes_italic,
      source_book: SOURCE_ALPHABETICAL,
      source_page: 1,
      source_position: position,
    });

    entry.translations.forEach((value, order_idx) => {
      translations.push({ word_id: id, lang: 'en', value, order_idx });
    });

    entry.collocations.forEach((col, ci) => {
      const phrase_clean = normalizeForId(col.he);
      collocations.push({
        id: collocationId(id, phrase_clean, ci),
        parent_word_id: id,
        phrase_he: col.he,
        phrase_clean,
        translation: col.translation,
        lang: 'en',
      });
    });
  });
}
