import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';
import { HebrewText } from '@/components/ui/HebrewText';

export interface DropSlotProps {
  position: number;     // 1-based label
  hebrew?: string | null;
  onPress?: () => void;
}

// Ordered slot: filled (glass + amber badge + grip + RTL sentence) or empty ("Drop here").
export function DropSlot({ position, hebrew, onPress }: DropSlotProps) {
  const filled = !!hebrew;
  return (
    <Pressable onPress={onPress} style={[styles.slot, filled ? styles.filled : styles.empty]}>
      <View style={[styles.badge, { backgroundColor: filled ? Colors.secondary : '#E5E4E1' }]}>
        <Text style={[styles.badgeText, { color: filled ? Colors.textLight : Colors.textMuted }]}>
          {position}
        </Text>
      </View>
      {filled ? (
        <>
          <Icon name="grip-vertical" size={18} color="#B0B0B0" />
          <HebrewText preset="sentence" color={Colors.text} style={styles.text}>
            {hebrew}
          </HebrewText>
        </>
      ) : (
        <Text style={styles.placeholder}>Drop here</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  filled: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#E5E4E1',
  },
  empty: {
    backgroundColor: 'rgba(245,244,241,0.4)',
    borderWidth: 1.5,
    borderColor: '#C4C4C4',
    borderStyle: 'dashed',
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  text: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});
