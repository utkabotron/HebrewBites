import type { AppCard, CanonicalDb, Tense } from './types.js';

const TENSES: Tense[] = ['past', 'present', 'future', 'imperative'];

export function denormalize(db: CanonicalDb): AppCard[] {
  const translationsByWord = groupBy(db.translations, (t) => t.word_id);
  const collocationsByWord = groupBy(db.collocations, (c) => c.parent_word_id);
  const examplesByWord = groupBy(db.examples, (e) => e.word_id);
  const conjugationsByWord = groupBy(db.conjugations, (c) => c.word_id);

  return db.words.map((w) => {
    const translations = (translationsByWord.get(w.id) ?? []).slice().sort((a, b) => a.order_idx - b.order_idx);
    const ru = translations.find((t) => t.lang === 'ru')?.value ?? null;
    const en = translations.find((t) => t.lang === 'en')?.value ?? null;

    const cols = (collocationsByWord.get(w.id) ?? []).map((c) => ({
      he: c.phrase_he,
      translation: c.translation,
      lang: c.lang,
    }));

    const exs = (examplesByWord.get(w.id) ?? [])
      .slice()
      .sort((a, b) => a.order_idx - b.order_idx)
      .map((e) => ({ he: e.sentence_he, translit: e.sentence_translit, ru: e.sentence_ru }));

    const conjRows = conjugationsByWord.get(w.id) ?? [];
    let conjugation: AppCard['conjugation'] = null;
    if (conjRows.length > 0) {
      conjugation = { past: [], present: [], future: [], imperative: [] };
      for (const tense of TENSES) {
        conjugation[tense] = conjRows
          .filter((r) => r.tense === tense)
          .map((r) => ({ person: r.person, he: r.form_he, translit: r.form_translit }));
      }
    }

    return {
      id: w.id,
      hebrew: w.headword_he,
      headword_clean: w.headword_clean,
      transliteration: w.transliteration,
      translation_ru: ru,
      translation_en: en,
      all_translations: translations.map((t) => ({ lang: t.lang, value: t.value })),
      pos: w.pos,
      binyan: w.binyan,
      notes: w.notes,
      collocations: cols,
      examples: exs,
      conjugation,
      source: `${w.source_book} p.${w.source_page}`,
    } satisfies AppCard;
  });
}

function groupBy<T, K>(arr: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const k = key(item);
    const list = map.get(k);
    if (list) list.push(item);
    else map.set(k, [item]);
  }
  return map;
}
