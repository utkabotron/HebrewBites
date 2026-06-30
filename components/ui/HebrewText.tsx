import { Text, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';

type Preset = 'word' | 'sentence' | 'paragraph' | 'body';

export interface HebrewTextProps extends TextProps {
  children: React.ReactNode;
  preset?: Preset;
  color?: string;
  align?: TextStyle['textAlign'];
}

// Per-node RTL Hebrew text. We do NOT use I18nManager.forceRTL (that would flip
// the whole LTR interface) — instead each Hebrew node carries writingDirection
// 'rtl' + right alignment. Hebrew has no Outfit glyphs, so the system font is used.
export function HebrewText({
  children,
  preset = 'body',
  color = Colors.text,
  align = 'right',
  style,
  ...rest
}: HebrewTextProps) {
  return (
    <Text style={[styles[preset], { color, textAlign: align }, style]} {...rest}>
      {children}
    </Text>
  );
}

const rtl: TextStyle = { writingDirection: 'rtl' };

const styles = StyleSheet.create({
  word: { ...rtl, fontSize: 48, fontWeight: '700', letterSpacing: -1 },
  sentence: { ...rtl, fontSize: 16, fontWeight: '500', fontFamily: Fonts.medium },
  paragraph: { ...rtl, fontSize: 18, lineHeight: 29 },
  body: { ...rtl, fontSize: 16 },
});
