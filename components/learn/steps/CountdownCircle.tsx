import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';

// Countdown ring with a timer glyph (visual only — no live animation in concept).
export function CountdownCircle({ size = 48 }: { size?: number }) {
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="timer" size={20} color={Colors.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 4,
    borderColor: Colors.amberTrack,
    borderTopColor: Colors.secondary,
    borderRightColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
