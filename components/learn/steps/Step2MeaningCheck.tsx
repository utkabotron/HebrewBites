import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScoreBar } from './ScoreBar';

export interface Step2Props {
  card: LearnCard;
  onNext: () => void;
}

export function Step2MeaningCheck({ card, onNext }: Step2Props) {
  const m = card.meaning;
  return (
    <>
      <Text style={styles.counter}>Sentence {m.index} of 4</Text>

      <View style={[GlassStyle.card, styles.card]}>
        <Text style={styles.sentence}>{m.ru}</Text>
      </View>

      <View style={[GlassStyle.cardStrong, styles.input]}>
        <Text style={styles.placeholder}>Type in Hebrew...</Text>
        <Icon name="keyboard" size={20} color={Colors.textMuted} />
      </View>

      <View style={styles.hintRow}>
        <Icon name="globe" size={14} color={Colors.textMuted} />
        <Text style={styles.hint}>Switch to Hebrew keyboard</Text>
      </View>

      <PrimaryButton label="Проверить" onPress={onNext} />

      <View style={styles.spacer} />

      <View style={styles.bottom}>
        <ScoreBar earned={25} total={100} fraction={0.2} />
        <Text style={styles.bonus}>+100 points possible</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  counter: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentence: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  input: {
    height: 56,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  hintRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  spacer: {
    flex: 1,
  },
  bottom: {
    gap: 10,
    alignItems: 'center',
  },
  bonus: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
});
