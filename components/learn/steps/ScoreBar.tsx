import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';

export interface ScoreBarProps {
  earned: number;
  total: number;
  fraction: number; // 0..1 fill of the mini track
}

// Compact "N / M points earned" bar with a star + mini progress track (Side 2 footer).
export function ScoreBar({ earned, total, fraction }: ScoreBarProps) {
  return (
    <View style={styles.bar}>
      <Icon name="star" size={18} color={Colors.primary} />
      <Text style={styles.text}>
        {earned} / {total} points earned
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, fraction)) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.scoreBg,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  track: {
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
