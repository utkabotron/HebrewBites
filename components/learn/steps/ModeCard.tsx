import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';

export interface ModeCardProps {
  icon: string;       // Lucide name
  title: string;
  desc: string;
  maxPts: number;
  onPress: () => void;
}

// Horizontal glass card: amber icon circle + title/desc + "Max N pts" badge (Side 3 mode select).
export function ModeCard({ icon, title, desc, maxPts, onPress }: ModeCardProps) {
  return (
    <Pressable onPress={onPress} style={[GlassStyle.card, styles.card]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Max {maxPts} pts</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.amberIconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
  desc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.amberIconBg,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
});
