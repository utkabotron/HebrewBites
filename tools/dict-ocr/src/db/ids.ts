import { createHash } from 'node:crypto';

export function sha1(input: string): string {
  return createHash('sha1').update(input, 'utf8').digest('hex');
}

export function wordId(headwordClean: string, sourceBook: string, sourcePosition: number): string {
  return `w_${sha1(`${headwordClean}|${sourceBook}|${sourcePosition}`).slice(0, 12)}`;
}

export function collocationId(parentWordId: string, phraseClean: string, idx: number): string {
  return `c_${sha1(`${parentWordId}|${phraseClean}|${idx}`).slice(0, 12)}`;
}

export function exampleId(wordId: string, sentenceHe: string, idx: number): string {
  return `e_${sha1(`${wordId}|${sentenceHe}|${idx}`).slice(0, 12)}`;
}

export function conjugationId(wordId: string, tense: string, person: string): string {
  return `cj_${sha1(`${wordId}|${tense}|${person}`).slice(0, 12)}`;
}
