import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { Icon } from './Icon';

export type BadgeVariant = 'bonus' | 'success' | 'reward' | 'amber' | 'recommended';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;          // Lucide name (optional leading icon)
  letterSpacing?: number;
  style?: ViewStyle;
}

// Compact status chip: BONUS / "Stage 1 Complete ✓" / "86% — Reward earned!" /
// "Max 100 pts" / "Recommended".
export function Badge({ label, variant = 'bonus', icon, letterSpacing, style }: BadgeProps) {
  const t = THEMES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      {icon && <Icon name={icon} size={12} color={t.fg} />}
      <Text style={[styles.text, { color: t.fg, letterSpacing }]}>{label}</Text>
    </View>
  );
}

const THEMES: Record<BadgeVariant, { bg: string; fg: string }> = {
  bonus: { bg: 'rgba(232,164,92,0.18)', fg: Colors.primary },
  success: { bg: 'rgba(76,175,80,0.12)', fg: Colors.success },
  reward: { bg: 'rgba(76,175,80,0.1)', fg: Colors.success },
  amber: { bg: 'rgba(255,243,224,1)', fg: Colors.primary },
  recommended: { bg: 'transparent', fg: Colors.secondary },
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
});
