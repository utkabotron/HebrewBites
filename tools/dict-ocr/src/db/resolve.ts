import type { ConjugationPage } from '../schemas/conjugation.js';
import type { VerbExamplesPage } from '../schemas/verb-examples.js';

import { normalizeForId } from '../diff/normalize-hebrew.js';
import { conjugationId, exampleId, wordId } from './ids.js';
import { mapBinyan } from './pos-mapping.js';
import { SOURCE_CONJUGATION, SOURCE_VERB_EXAMPLES } from './build.js';
import type { Conjugation, Example, Tense, Translation, Word } from './types.js';

function lemmaFromVerbHeadword(headword: string): string {
  const firstPart = headword.split(',')[0] ?? headword;
  return normalizeForId(firstPart);
}

/** Subsequence check: do `root` letters appear in `lemma` in order? */
function rootInLemma(lemma: string, root: string): boolean {
  const cleanRoot = normalizeForId(root);
  let i = 0;
  for (const c of lemma) {
    if (c === cleanRoot[i]) i += 1;
    if (i === cleanRoot.length) return true;
  }
  return false;
}

export function resolveVerbExamples(
  page: VerbExamplesPage,
  words: Word[],
  translations: Translation[],
  examples: Example[],
): void {
  page.entries.forEach((entry, position) => {
    const lemma = lemmaFromVerbHeadword(entry.headword_he);
    const binyan = mapBinyan(entry.conjugation_pattern);

    let match = words.find(
      (w) =>
        w.headword_clean === lemma &&
        (w.pos === 'verb' || w.pos === 'other') &&
        (w.binyan === null || w.binyan === binyan),
    );

    if (match) {
      // Upgrade existing record with verb-specific data
      if (match.pos !== 'verb') match.pos = 'verb';
      if (!match.binyan) match.binyan = binyan;
      // Add ru translation
      const hasRu = translations.some(
        (t) => t.word_id === match!.id && t.lang === 'ru' && t.value === entry.headword_translation_ru,
      );
      if (!hasRu && entry.headword_translation_ru) {
        const order = translations.filter((t) => t.word_id === match!.id && t.lang === 'ru').length;
        translations.push({
          word_id: match.id,
          lang: 'ru',
          value: entry.headword_translation_ru,
          order_idx: order,
        });
      }
    } else {
      const id = wordId(lemma, SOURCE_VERB_EXAMPLES, position);
      match = {
        id,
        headword_he: entry.headword_he,
        headword_clean: lemma,
        transliteration: null,
        pos: 'verb',
        pos_raw: null,
        binyan,
        sense_idx: 0,
        notes: [],
        source_book: SOURCE_VERB_EXAMPLES,
        source_page: 1,
        source_position: position,
      };
      words.push(match);
      if (entry.headword_translation_ru) {
        translations.push({
          word_id: id,
          lang: 'ru',
          value: entry.headword_translation_ru,
          order_idx: 0,
        });
      }
    }

    entry.examples.forEach((ex, order_idx) => {
      examples.push({
        id: exampleId(match!.id, ex.he, order_idx),
        word_id: match!.id,
        sentence_he: ex.he,
        sentence_translit: ex.translit,
        sentence_ru: ex.ru,
        order_idx,
      });
    });
  });
}

export function resolveConjugations(
  page: ConjugationPage,
  words: Word[],
  conjugations: Conjugation[],
): void {
  const TENSES: Tense[] = ['past', 'present', 'future', 'imperative'];

  page.entries.forEach((entry, position) => {
    const binyan = mapBinyan(entry.binyan);

    let match = words.find(
      (w) =>
        w.pos === 'verb' &&
        w.binyan === binyan &&
        rootInLemma(w.headword_clean, entry.root),
    );

    if (match) {
      if (!match.transliteration && entry.infinitive_translit) {
        match.transliteration = entry.infinitive_translit;
      }
    } else {
      const lemma = normalizeForId(entry.root);
      const id = wordId(lemma, SOURCE_CONJUGATION, position);
      match = {
        id,
        headword_he: entry.infinitive_he,
        headword_clean: lemma,
        transliteration: entry.infinitive_translit ?? null,
        pos: 'verb',
        pos_raw: null,
        binyan,
        sense_idx: 0,
        notes: [],
        source_book: SOURCE_CONJUGATION,
        source_page: 1,
        source_position: position,
      };
      words.push(match);
    }

    for (const tense of TENSES) {
      const forms = entry.tenses[tense];
      for (const f of forms) {
        conjugations.push({
          id: conjugationId(match!.id, tense, f.person),
          word_id: match!.id,
          tense,
          person: f.person,
          form_he: f.he,
          form_translit: f.translit,
        });
      }
    }
  });
}
