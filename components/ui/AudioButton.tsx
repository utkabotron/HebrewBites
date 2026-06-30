import { Pressable, StyleSheet } from 'react-native';
import { Colors, GlassStyle } from '@/constants/Colors';
import { Icon } from './Icon';

export interface AudioButtonProps {
  size?: number;
  icon?: string;            // Lucide name, default volume-2
  color?: string;
  filled?: boolean;         // solid amber circle (Side 4 play)
  onPress?: () => void;
}

// Round audio control. Visual only (no real playback in the concept).
export function AudioButton({
  size = 44,
  icon = 'volume-2',
  color,
  filled = false,
  onPress,
}: AudioButtonProps) {
  const iconColor = color ?? (filled ? Colors.textLight : Colors.primary);
  return (
    <Pressable
      onPress={onPress}
      style={[
        filled ? styles.filled : GlassStyle.cardStrong,
        { width: size, height: size, borderRadius: size / 2 },
        styles.center,
      ]}
      hitSlop={6}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  filled: {
    backgroundColor: Colors.secondary,
  },
});
