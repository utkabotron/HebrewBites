// Types for the 4-sided learn session (concept UI, hardcoded data — no backend).

// State-machine steps of one continuous card session.
export type Step =
  | 's1_word'        // Side 1 — word introduction
  | 's2_meaning'     // Side 2 — meaning check
  | 'gate_complete'  // Mandatory part complete (finish or continue to bonus)
  | 's4_modeselect'  // Side 3 — bonus mode select
  | 's5_full'        // Side 3 — full reproduction
  | 's6_blanks'      // Side 3 — fill in the blanks
  | 's7_reading'     // Side 4 — text reading
  | 's8_order'       // Side 4 — sentence order
  | 's9_modechoice'  // Side 4 — choose response mode
  | 'done';          // Session-complete summary

// Drives the accent palette of the shared frame.
export type Accent = 'mandatory' | 'bonus';

// Bonus practice mode (Step4) the user picks for Side 3.
export type BonusModeKey = 'full' | 'partial' | 'audio';

export interface LearnSentence {
  hebrew: string;
  translit?: string;
  ru: string;
}

export interface BonusMode {
  key: BonusModeKey;
  icon: string;   // Lucide name (mapped to Ionicons via <Icon/>)
  title: string;
  desc: string;
  maxPts: number;
}

export interface ResponseMode {
  key: string;
  icon: string;   // Lucide name
  title: string;
  desc: string;
  maxPts: number;
  recommended: boolean;
}

export interface ScorePair {
  earned: number;
  total: number;
}

export interface LearnCard {
  word: {
    hebrew: string;
    root: string;
    tag: string;
    translit: string;
  };
  // The 4 example sentences shown on Side 1 / checked on Side 2.
  sentences: LearnSentence[];
  // Side 2 meaning-check uses one sentence (Russian prompt → Hebrew answer).
  meaning: {
    ru: string;        // prompt shown on the card
    answer: string;    // expected Hebrew (visual only, not verified)
    index: number;     // 1-based "Sentence N of 4"
  };
  // Side 3 fill-in-the-blanks (inline blank in a single RTL sentence).
  blank: {
    left: string;      // Hebrew chunk rendered left of the blank
    right: string;     // Hebrew chunk rendered right of the blank
    answer: string;    // expected word (visual only)
    hint: string;      // translation hint
  };
  // Side 4 reading paragraph.
  paragraph: {
    hebrew: string;
    durationSec: number; // audio length
    readSec: number;     // countdown to reproduce
  };
  // Side 4 sentence-order exercise (correct order top→bottom).
  orderSentences: string[];
  // Static scores for the mandatory-complete gate (predeclared, no math logic).
  scores: {
    side1: ScorePair;
    side2: ScorePair;
    totalEarned: number;
    totalPossible: number;
    percent: number;
  };
  bonusModes: BonusMode[];
  responseModes: ResponseMode[];
  pointsSide1: number;
}
