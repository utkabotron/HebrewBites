import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';
import { HebrewText } from '@/components/ui/HebrewText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PaginationDots } from '@/components/ui/PaginationDots';

export interface Step5Props {
  card: LearnCard;
  onNext: () => void;
}

export function Step5FullReproduction({ card, onNext }: Step5Props) {
  const total = card.sentences.length;
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < total - 1) setIndex(index + 1);
    else onNext();
  };

  return (
    <>
      <View style={styles.counterRow}>
        <Text style={styles.counter}>Sentence {index + 1} of {total}</Text>
        <View style={styles.bonusBadge}>
          <Icon name="star" size={12} color={Colors.textLight} />
          <Text style={styles.bonusText}>BONUS</Text>
        </View>
      </View>

      <Text style={styles.instruction}>Write this sentence from memory</Text>

      <View style={styles.spacer} />

      <View style={[GlassStyle.card, styles.inputCard]}>
        <HebrewText preset="paragraph" color={Colors.textMuted} style={styles.placeholder}>
          כתוב את המשפט...
        </HebrewText>
      </View>

      <Text style={styles.hintLink}>I need a hint</Text>

      <PrimaryButton label="Next" onPress={handleNext} variant="amber" />

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
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondary,
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  bonusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    letterSpacing: 0.5,
    color: Colors.textLight,
  },
  instruction: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  inputCard: {
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: '100%',
  },
  hintLink: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
