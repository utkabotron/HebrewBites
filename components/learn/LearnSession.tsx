import { useReducer } from 'react';
import { router } from 'expo-router';
import type { Accent, BonusModeKey, LearnCard, Step } from '@/constants/learnTypes';
import { SessionFrame } from '@/components/ui/SessionFrame';
import { Step1WordIntro } from './steps/Step1WordIntro';
import { Step2MeaningCheck } from './steps/Step2MeaningCheck';
import { GateComplete } from './steps/GateComplete';
import { Step4ModeSelect } from './steps/Step4ModeSelect';
import { Step5FullReproduction } from './steps/Step5FullReproduction';
import { Step6FillBlanks } from './steps/Step6FillBlanks';
import { Step7TextReading } from './steps/Step7TextReading';
import { Step8SentenceOrder } from './steps/Step8SentenceOrder';
import { Step9ModeChoice } from './steps/Step9ModeChoice';
import { SessionComplete } from './steps/SessionComplete';

interface SessionState {
  step: Step;
  mode: BonusModeKey | null;
  history: Step[];
}

type Action =
  | { type: 'go'; step: Step }
  | { type: 'pick'; mode: BonusModeKey; step: Step }
  | { type: 'back' }
  | { type: 'reset' };

const INITIAL: SessionState = { step: 's1_word', mode: null, history: [] };

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'go':
      return { ...state, step: action.step, history: [...state.history, state.step] };
    case 'pick':
      return { ...state, step: action.step, mode: action.mode, history: [...state.history, state.step] };
    case 'back': {
      if (state.history.length === 0) return state;
      const history = state.history.slice(0, -1);
      const prev = state.history[state.history.length - 1];
      return { ...state, step: prev, history };
    }
    case 'reset':
      return INITIAL;
  }
}

// Per-step chrome config: header title, progress fraction (Side N of 4), scroll.
const CHROME: Record<Step, { title?: string; progress?: number; scroll: boolean }> = {
  s1_word: { title: 'Side 1 of 4', progress: 1 / 4, scroll: true },
  s2_meaning: { title: 'Side 2 of 4', progress: 2 / 4, scroll: false },
  gate_complete: { title: '', scroll: true },
  s4_modeselect: { title: 'Side 3 of 4', progress: 3 / 4, scroll: true },
  s5_full: { title: 'Side 3 of 4', progress: 3 / 4, scroll: false },
  s6_blanks: { title: 'Side 3 of 4', progress: 3 / 4, scroll: false },
  s7_reading: { title: 'Side 4 of 4', progress: 4 / 4, scroll: true },
  s8_order: { title: 'Side 4 of 4', progress: 4 / 4, scroll: true },
  s9_modechoice: { title: 'Side 4 of 4', progress: 4 / 4, scroll: false },
  done: { scroll: false },
};

function accentFor(step: Step): Accent {
  switch (step) {
    case 's4_modeselect':
    case 's5_full':
    case 's6_blanks':
    case 's7_reading':
    case 's8_order':
    case 's9_modechoice':
      return 'bonus';
    default:
      return 'mandatory';
  }
}

export interface LearnSessionProps {
  card: LearnCard;
}

export function LearnSession({ card }: LearnSessionProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const { step } = state;

  const go = (next: Step) => dispatch({ type: 'go', step: next });
  const close = () => router.back();
  const handleBack = () => {
    if (state.history.length === 0) router.back();
    else dispatch({ type: 'back' });
  };

  // Session-complete summary is a standalone screen (own layout).
  if (step === 'done') {
    return (
      <SessionComplete
        card={card}
        onExit={close}
        onRestart={() => dispatch({ type: 'reset' })}
      />
    );
  }

  const chrome = CHROME[step];
  const accent = accentFor(step);

  let body: React.ReactNode = null;
  switch (step) {
    case 's1_word':
      body = <Step1WordIntro card={card} onNext={() => go('s2_meaning')} />;
      break;
    case 's2_meaning':
      body = <Step2MeaningCheck card={card} onNext={() => go('gate_complete')} />;
      break;
    case 'gate_complete':
      body = (
        <GateComplete
          card={card}
          onFinish={() => go('done')}
          onContinue={() => go('s4_modeselect')}
        />
      );
      break;
    case 's4_modeselect':
      body = (
        <Step4ModeSelect
          card={card}
          onPick={(mode) =>
            dispatch({ type: 'pick', mode, step: mode === 'full' ? 's5_full' : 's6_blanks' })
          }
        />
      );
      break;
    case 's5_full':
      body = <Step5FullReproduction card={card} onNext={() => go('s7_reading')} />;
      break;
    case 's6_blanks':
      body = <Step6FillBlanks card={card} mode={state.mode} onNext={() => go('s7_reading')} />;
      break;
    case 's7_reading':
      body = <Step7TextReading card={card} onNext={() => go('s8_order')} />;
      break;
    case 's8_order':
      body = <Step8SentenceOrder card={card} onNext={() => go('s9_modechoice')} />;
      break;
    case 's9_modechoice':
      body = <Step9ModeChoice card={card} onChoose={() => go('done')} />;
      break;
  }

  return (
    <SessionFrame
      accent={accent}
      title={chrome.title}
      progress={chrome.progress}
      onBack={handleBack}
      onClose={close}
      scroll={chrome.scroll}
    >
      {body}
    </SessionFrame>
  );
}
