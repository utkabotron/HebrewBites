import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import { Icon } from '@/components/ui/Icon';

export interface ChoiceCardProps {
  icon: string;       // Lucide name
  title: string;
  desc: string;
  maxPts: number;
  recommended?: boolean;
  onPress: () => void;
}

// Side 4 response-mode card: amber icon circle, title/desc, points badge, optional "Recommended".
export function ChoiceCard({ icon, title, desc, maxPts, recommended, onPress }: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, recommended ? styles.recommended : styles.plain]}
    >
      <View style={styles.iconCircle}>
        <Icon name={icon} size={30} color={Colors.textLight} />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>

      <View style={[styles.badge, recommended ? styles.badgeSuccess : styles.badgeAmber]}>
        <Text style={[styles.badgeText, { color: recommended ? Colors.success : Colors.primary }]}>
          Max {maxPts} pts
        </Text>
      </View>

      {recommended && (
        <View style={styles.recRow}>
          <Icon name="star" size={14} color={Colors.secondary} />
          <Text style={styles.recText}>Recommended</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  recommended: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(232,164,92,0.5)',
  },
  plain: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    gap: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeSuccess: {
    backgroundColor: 'rgba(76,175,80,0.12)',
  },
  badgeAmber: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
  },
  recRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  recText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.secondary,
  },
});
