import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '@/constants/Colors';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'amber' | 'outline';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: string;       // Lucide name, optional leading icon
  height?: number;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  height = 52,
  style,
}: PrimaryButtonProps) {
  const outline = variant === 'outline';
  const amber = variant === 'amber';
  const textColor = outline ? Colors.primary : Colors.textLight;

  const inner = (
    <>
      {icon && <Icon name={icon} size={18} color={textColor} />}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </>
  );

  if (amber) {
    return (
      <Pressable onPress={onPress} style={[styles.shadowAmber, style]}>
        <LinearGradient
          colors={Colors.gradients.amberButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, { height }]}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        { height },
        outline ? styles.outline : styles.primary,
        !outline && styles.shadowPrimary,
        style,
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  shadowPrimary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  shadowAmber: {
    borderRadius: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
});
