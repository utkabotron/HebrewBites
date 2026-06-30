import type { LearnCard } from './learnTypes';

// One rich hardcoded card that feeds all 9 steps of the learn session.
// All strings are literals; all totals are pre-computed (no runtime math/grading).
export const SAMPLE_CARD: LearnCard = {
  word: {
    hebrew: 'לִלְמוֹד',
    root: 'ל.מ.ד',
    tag: 'verb, infinitive',
    translit: 'lilmod',
  },
  sentences: [
    { hebrew: 'אני לומד עברית כל יום', ru: 'Я учу иврит каждый день' },
    { hebrew: 'היא למדה במהירות', ru: 'Она быстро выучила' },
    { hebrew: 'אנחנו נלמד ביחד מחר', ru: 'Мы будем учиться вместе завтра' },
    { hebrew: 'הם לומדים בבית הספר', ru: 'Они учатся в школе' },
  ],
  meaning: {
    ru: 'Она быстро выучила',
    answer: 'היא למדה במהירות',
    index: 2,
  },
  blank: {
    // Reads RTL as "אני [לומד] עברית כל יום" → "I [learn] Hebrew every day".
    // Rendered left→right on screen: "עברית כל יום" [blank] "אני".
    left: 'עברית כל יום',
    right: 'אני',
    answer: 'לומד',
    hint: '"I _____ Hebrew every day"',
  },
  paragraph: {
    hebrew:
      'שלום! אני לומד עברית כל יום. אני אוהב ללמוד מילים חדשות. בבוקר אני קורא ובערב אני כותב.',
    durationSec: 32,
    readSec: 45,
  },
  orderSentences: [
    'שלום! אני לומד עברית כל יום.',
    'בבוקר אני קורא ובערב אני כותב.',
    'אני אוהב ללמוד מילים חדשות.',
    'העברית היא שפה יפה מאוד.',
  ],
  scores: {
    side1: { earned: 52, total: 60 },
    side2: { earned: 85, total: 100 },
    totalEarned: 137,
    totalPossible: 160,
    percent: 86,
  },
  bonusModes: [
    {
      key: 'full',
      icon: 'pencil',
      title: 'Полное воспроизведение',
      desc: 'Write all 4 sentences from memory',
      maxPts: 100,
    },
    {
      key: 'partial',
      icon: 'puzzle',
      title: 'Частичное восстановление',
      desc: 'Fill in missing words in sentences',
      maxPts: 80,
    },
    {
      key: 'audio',
      icon: 'headphones',
      title: 'Аудиодиктант',
      desc: 'Listen and write what you hear',
      maxPts: 60,
    },
  ],
  responseModes: [
    {
      key: 'speak',
      icon: 'mic',
      title: 'Speak from Memory',
      desc: 'Record yourself speaking the text without looking',
      maxPts: 100,
      recommended: true,
    },
    {
      key: 'assemble',
      icon: 'grid-2x2',
      title: 'Assemble from Words',
      desc: 'Drag scattered words into correct order',
      maxPts: 70,
      recommended: false,
    },
  ],
  pointsSide1: 60,
};

// Look up a card by set id; falls back to the sample card (concept has no real data).
export function getLearnCard(_setId?: string): LearnCard {
  return SAMPLE_CARD;
}
