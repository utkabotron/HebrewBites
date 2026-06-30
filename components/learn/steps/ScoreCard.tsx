import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Badge } from '@/components/ui/Badge';

function Row({
  label,
  earned,
  total,
  bold,
  barHeight,
}: {
  label: string;
  earned: number;
  total: number;
  bold?: boolean;
  barHeight: number;
}) {
  const frac = total > 0 ? earned / total : 0;
  return (
    <View style={styles.rowWrap}>
      <View style={styles.rowTop}>
        <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
        <Text style={[styles.value, bold && styles.bold]}>
          {earned} / {total}
        </Text>
      </View>
      <View style={[styles.track, { height: barHeight, borderRadius: barHeight / 2 }]}>
        <View
          style={{
            width: `${frac * 100}%`,
            height: '100%',
            borderRadius: barHeight / 2,
            backgroundColor: Colors.success,
          }}
        />
      </View>
    </View>
  );
}

// Mandatory-complete score breakdown: Side 1, Side 2, divider, Total, reward badge.
export function ScoreCard({ card }: { card: LearnCard }) {
  const s = card.scores;
  return (
    <View style={[GlassStyle.card, styles.card]}>
      <Row label="Side 1" earned={s.side1.earned} total={s.side1.total} barHeight={6} />
      <Row label="Side 2" earned={s.side2.earned} total={s.side2.total} barHeight={6} />
      <View style={styles.divider} />
      <Row label="Total" earned={s.totalEarned} total={s.totalPossible} bold barHeight={8} />
      <Badge
        label={`${s.percent}% — Reward earned!`}
        variant="reward"
        style={styles.badge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 14,
  },
  rowWrap: {
    gap: 6,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  bold: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  track: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  badge: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 8,
  },
});
