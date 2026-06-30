import { Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';
import { HebrewText } from '@/components/ui/HebrewText';

export interface DragCardProps {
  hebrew: string;
  onPress?: () => void;
}

// Remaining (tap-to-place) card: grip + RTL sentence in a glass row.
export function DragCard({ hebrew, onPress }: DragCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Icon name="grip-vertical" size={18} color="#B0B0B0" />
      <HebrewText preset="sentence" color={Colors.text} style={styles.text}>
        {hebrew}
      </HebrewText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#E5E4E1',
  },
  text: {
    flex: 1,
  },
});
