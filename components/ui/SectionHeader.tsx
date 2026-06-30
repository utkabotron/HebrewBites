import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';

export interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

// Row: section title (left) + optional action link (right, primary).
export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
});
