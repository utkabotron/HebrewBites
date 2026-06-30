import { View, type ViewProps, type ViewStyle } from 'react-native';
import { GlassStyle } from '@/constants/Colors';

export interface GlassCardProps extends ViewProps {
  strong?: boolean;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

// Wraps the shared GlassStyle.card / cardStrong tokens. Pass `radius` to override
// the default 20 (designs use 16 for list rows / mode cards).
export function GlassCard({ strong, radius, style, children, ...rest }: GlassCardProps) {
  return (
    <View
      style={[
        strong ? GlassStyle.cardStrong : GlassStyle.card,
        radius != null && { borderRadius: radius },
        style as ViewStyle,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
