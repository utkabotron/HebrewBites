import { Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { GlassCard } from '@/components/ui/GlassCard';
import { HebrewText } from '@/components/ui/HebrewText';
import { Pill } from '@/components/ui/Pill';
import { AudioButton } from '@/components/ui/AudioButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SentenceRow } from '@/components/ui/SentenceRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export interface Step1Props {
  card: LearnCard;
  onNext: () => void;
}

export function Step1WordIntro({ card, onNext }: Step1Props) {
  return (
    <>
      <GlassCard style={styles.wordCard}>
        <HebrewText preset="word" color={Colors.text}>
          {card.word.hebrew}
        </HebrewText>
        <HebrewText preset="body" color={Colors.textSecondary} style={styles.root}>
          {card.word.root}
        </HebrewText>
        <Pill label={card.word.tag} />
        <AudioButton icon="volume-2" />
      </GlassCard>

      <SectionHeader title="4 Sentences" action="Listen All" />

      {card.sentences.map((s, i) => (
        <SentenceRow key={i} hebrew={s.hebrew} />
      ))}

      <Text style={styles.points}>+{card.pointsSide1} points</Text>

      <PrimaryButton label="Continue" onPress={onNext} />
    </>
  );
}

const styles = StyleSheet.create({
  wordCard: {
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  root: {
    fontSize: 18,
    fontWeight: '500',
  },
  points: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.points,
  },
});
