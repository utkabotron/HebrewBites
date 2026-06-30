import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

// Inline blank slot with an amber cursor (visual only — no real input).
export function BlankField() {
  return (
    <View style={styles.field}>
      <View style={styles.cursor} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: 80,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    backgroundColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    width: 2,
    height: 20,
    borderRadius: 1,
    backgroundColor: Colors.secondary,
  },
});
