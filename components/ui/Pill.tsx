import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';

export interface PillProps {
  label: string;
  bg?: string;
  color?: string;
  fontSize?: number;
  style?: ViewStyle;
}

// Small rounded label chip (e.g. the word's "verb, infinitive" tag).
export function Pill({ label, bg = Colors.deco1, color = Colors.primary, fontSize = 13, style }: PillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color, fontSize }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  text: {
    fontWeight: '500',
    fontFamily: Fonts.medium,
  },
});
