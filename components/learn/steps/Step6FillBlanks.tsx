import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { BonusModeKey, LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { HebrewText } from '@/components/ui/HebrewText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PaginationDots } from '@/components/ui/PaginationDots';
import { BlankField } from './BlankField';

export interface Step6Props {
  card: LearnCard;
  mode: BonusModeKey | null;
  onNext: () => void;
}

export function Step6FillBlanks({ card, mode, onNext }: Step6Props) {
  const total = card.sentences.length;
  const [index, setIndex] = useState(0);
  const b = card.blank;

  const handleCheck = () => {
    if (index < total - 1) setIndex(index + 1);
    else onNext();
  };

  const instruction =
    mode === 'audio' ? 'Listen and type what you hear:' : 'Complete the sentence:';

  return (
    <>
      <View style={styles.counterRow}>
        <Text style={styles.counter}>Sentence {index + 1} of {total}</Text>
        <Badge label="BONUS" variant="bonus" icon="sparkles" letterSpacing={0.5} />
      </View>

      <View style={[GlassStyle.cardStrong, styles.instructionCard]}>
        <View style={styles.instructionRow}>
          <Icon name="pen-line" size={16} color={Colors.secondary} />
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>

        <View style={styles.sentenceArea}>
          <View style={styles.hebrewLine}>
            <HebrewText preset="body" color={Colors.text} style={styles.word}>
              {b.left}
            </HebrewText>
            <BlankField />
            <HebrewText preset="body" color={Colors.text} style={styles.word}>
              {b.right}
            </HebrewText>
          </View>
        </View>

        <View style={styles.transHint}>
          <Icon name="languages" size={14} color={Colors.textMuted} />
          <Text style={styles.transHintText}>{b.hint}</Text>
        </View>
      </View>

      <View style={styles.kbdHint}>
        <Icon name="keyboard" size={18} color={Colors.textMuted} />
        <Text style={styles.kbdHintText}>Type your answer using the Hebrew keyboard</Text>
      </View>

      <View style={styles.spacer} />

      <PrimaryButton label="Check" onPress={handleCheck} variant="amber" />

      <PaginationDots count={total} index={index} accent="bonus" />
    </>
  );
}

const styles = StyleSheet.create({
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  instructionCard: {
    borderRadius: 20,
    padding: 24,
    gap: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  sentenceArea: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.amberTrack,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  hebrewLine: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  word: {
    fontSize: 26,
    fontWeight: '600',
  },
  transHint: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transHintText: {
    fontSize: 13,
    fontStyle: 'italic',
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  kbdHint: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kbdHintText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  spacer: {
    flex: 1,
  },
});
