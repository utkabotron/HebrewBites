export type Pos =
  | 'noun_m'
  | 'noun_f'
  | 'noun_mf'
  | 'adj'
  | 'verb'
  | 'adv'
  | 'prep'
  | 'interj'
  | 'abbr'
  | 'particle'
  | 'other';

export type Binyan =
  | 'paal'
  | 'nifal'
  | 'piel'
  | 'pual'
  | 'hifil'
  | 'hufal'
  | 'hitpael';

export interface PosResult {
  pos: Pos;
  secondaryPos?: Pos;
}

const POS_TABLE: Record<string, PosResult> = {
  'ז': { pos: 'noun_m' },
  'נ': { pos: 'noun_f' },
  'ז,נ': { pos: 'noun_mf' },
  'ז"נ': { pos: 'noun_mf' },
  'ת': { pos: 'adj' },
  'ת"ז': { pos: 'adj', secondaryPos: 'noun_m' },
  'פ': { pos: 'verb' },
  'תה"פ': { pos: 'adv' },
  'מ"י': { pos: 'interj' },
  'מ"ג': { pos: 'prep' },
  'ר': { pos: 'particle' },
  'מ"ח': { pos: 'particle' },
};

export function normalizeHebrewTag(raw: string): string {
  // Collapse: strip whitespace + bidi controls, normalize all quote-like chars.
  const collapsed = raw.replace(/[\s‎‏‪-‮]+/g, '').replace(/[׳״]+/g, '"').trim();
  // If only a single trailing apostrophe (Hebrew abbreviation marker like פ'),
  // strip it — `פ'` and `פ` mean the same POS.
  if (/^[א-ת]+'$/.test(collapsed)) return collapsed.slice(0, -1);
  // Otherwise treat ' the same as " (used in multi-letter abbreviations like ת"ז).
  return collapsed.replace(/'/g, '"');
}

export function mapPos(raw: string | null | undefined): PosResult {
  if (!raw) return { pos: 'other' };
  const key = normalizeHebrewTag(raw);
  const hit = POS_TABLE[key];
  if (hit) return hit;
  return { pos: 'other' };
}

const BINYAN_TABLE: Record<string, Binyan> = {
  'פעל': 'paal',
  'נפעל': 'nifal',
  'פיעל': 'piel',
  'פועל': 'pual',
  'הפעיל': 'hifil',
  'הופעל': 'hufal',
  'התפעל': 'hitpael',
};

export function mapBinyan(raw: string | null | undefined): Binyan | null {
  if (!raw) return null;
  const key = raw.replace(/[\s‎‏]+/g, '').trim();
  return BINYAN_TABLE[key] ?? null;
}
