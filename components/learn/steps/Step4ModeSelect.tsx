import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import type { BonusModeKey, LearnCard } from '@/constants/learnTypes';
import { Badge } from '@/components/ui/Badge';
import { ModeCard } from './ModeCard';

export interface Step4Props {
  card: LearnCard;
  onPick: (mode: BonusModeKey) => void;
}

export function Step4ModeSelect({ card, onPick }: Step4Props) {
  return (
    <>
      <View style={styles.titleSection}>
        <Badge label="BONUS" variant="bonus" letterSpacing={1} style={styles.bonusBadge} />
        <Text style={styles.title}>Контроль формы</Text>
        <Text style={styles.subtitle}>Choose your practice mode</Text>
      </View>

      <View style={styles.cards}>
        {card.bonusModes.map((m) => (
          <ModeCard
            key={m.key}
            icon={m.icon}
            title={m.title}
            desc={m.desc}
            maxPts={m.maxPts}
            onPress={() => onPick(m.key)}
          />
        ))}
      </View>

      <Text style={styles.bottom}>This section is optional — for extra points and rewards</Text>
    </>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    gap: 8,
  },
  bonusBadge: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    letterSpacing: -0.3,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  cards: {
    gap: 16,
  },
  bottom: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
