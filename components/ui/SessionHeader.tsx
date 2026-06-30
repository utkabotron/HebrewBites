import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import { Icon } from './Icon';

export interface SessionHeaderProps {
  title: string;
  onBack: () => void;   // step back within the session
  onClose: () => void;  // exit the modal (router.back)
}

// Glass-circle back chevron + center title + glass-circle close.
export function SessionHeader({ title, onBack, onClose }: SessionHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={[GlassStyle.card, styles.circle]} hitSlop={8}>
        <Icon name="chevron-left" size={20} color={Colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onClose} style={[GlassStyle.card, styles.circle]} hitSlop={8}>
        <Icon name="x" size={18} color={Colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
});
