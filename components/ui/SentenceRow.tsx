import { View, Pressable, StyleSheet } from 'react-native';
import { Colors, GlassStyle } from '@/constants/Colors';
import { HebrewText } from './HebrewText';
import { Icon } from './Icon';

export interface SentenceRowProps {
  hebrew: string;
  onPlay?: () => void;
}

// Glass row: RTL Hebrew sentence + play icon (Side 1 "4 Sentences" list).
export function SentenceRow({ hebrew, onPlay }: SentenceRowProps) {
  return (
    <View style={[GlassStyle.card, styles.row]}>
      <HebrewText preset="sentence" style={styles.text}>
        {hebrew}
      </HebrewText>
      <Pressable onPress={onPlay} hitSlop={8}>
        <Icon name="play" size={20} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  text: {
    flex: 1,
  },
});
