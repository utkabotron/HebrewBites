import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import type { Accent } from '@/constants/learnTypes';

export interface PaginationDotsProps {
  count: number;
  index: number;      // active dot (0-based)
  accent?: Accent;
}

export function PaginationDots({ count, index, accent = 'bonus' }: PaginationDotsProps) {
  const activeColor = accent === 'bonus' ? Colors.secondary : Colors.primary;
  const inactiveColor = accent === 'bonus' ? Colors.amberTrack : Colors.progressTrack;
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => {
        const active = i === index;
        return (
          <View
            key={i}
            style={{
              width: active ? 10 : 8,
              height: active ? 10 : 8,
              borderRadius: 5,
              backgroundColor: active ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
