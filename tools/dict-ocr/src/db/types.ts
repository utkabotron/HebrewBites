import type { Binyan, Pos } from './pos-mapping.js';

export type Lang = 'ru' | 'en';
export type Tense = 'past' | 'present' | 'future' | 'imperative';

export interface Word {
  id: string;
  headword_he: string;
  headword_clean: string;
  transliteration: string | null;
  pos: Pos;
  pos_raw: string | null;
  binyan: Binyan | null;
  sense_idx: number;
  notes: string[];
  source_book: string;
  source_page: number;
  source_position: number;
}

export interface Translation {
  word_id: string;
  lang: Lang;
  value: string;
  order_idx: number;
}

export interface Collocation {
  id: string;
  parent_word_id: string;
  phrase_he: string;
  phrase_clean: string;
  translation: string;
  lang: Lang;
}

export interface Example {
  id: string;
  word_id: string;
  sentence_he: string;
  sentence_translit: string;
  sentence_ru: string;
  order_idx: number;
}

export interface Conjugation {
  id: string;
  word_id: string;
  tense: Tense;
  person: string;
  form_he: string;
  form_translit: string;
}

export interface DbMeta {
  extracted_at: string;
  model: string;
  sources: string[];
}

export interface CanonicalDb {
  meta: DbMeta;
  words: Word[];
  translations: Translation[];
  collocations: Collocation[];
  examples: Example[];
  conjugations: Conjugation[];
}

export interface AppCard {
  id: string;
  hebrew: string;
  headword_clean: string;
  transliteration: string | null;
  translation_ru: string | null;
  translation_en: string | null;
  all_translations: Array<{ lang: Lang; value: string }>;
  pos: Pos;
  binyan: Binyan | null;
  notes: string[];
  collocations: Array<{ he: string; translation: string; lang: Lang }>;
  examples: Array<{ he: string; translit: string; ru: string }>;
  conjugation: Record<Tense, Array<{ person: string; he: string; translit: string }>> | null;
  source: string;
}
