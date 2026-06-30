import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Badge } from '@/components/ui/Badge';
import { ChoiceCard } from './ChoiceCard';

export interface Step9Props {
  card: LearnCard;
  onChoose: (key: string) => void;
}

export function Step9ModeChoice({ card, onChoose }: Step9Props) {
  return (
    <>
      <Badge label="Stage 1 Complete ✓" variant="success" />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Choose your response mode</Text>
        <Text style={styles.subtitle}>How would you like to reproduce the text?</Text>
      </View>

      <View style={styles.cards}>
        {card.responseModes.map((m) => (
          <ChoiceCard
            key={m.key}
            icon={m.icon}
            title={m.title}
            desc={m.desc}
            maxPts={m.maxPts}
            recommended={m.recommended}
            onPress={() => onChoose(m.key)}
          />
        ))}
      </View>

      <View style={styles.spacer} />

      <Text style={styles.helper}>Choose based on your comfort level</Text>
    </>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cards: {
    gap: 20,
  },
  spacer: {
    flex: 1,
  },
  helper: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
