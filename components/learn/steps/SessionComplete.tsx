import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';

export interface SessionCompleteProps {
  card: LearnCard;
  onExit: () => void;
  onRestart: () => void;
}

// Session-complete summary: trophy + stats + actions (terminal screen of the flow).
export function SessionComplete({ card, onExit, onRestart }: SessionCompleteProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.circle, styles.c1]} />
      <View style={[styles.circle, styles.c2]} />

      <View style={styles.content}>
        <View style={[GlassStyle.cardStrong, styles.trophy]}>
          <Icon name="trophy" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.subtitle}>Great job! You're making progress.</Text>

        <View style={styles.stats}>
          <View style={[GlassStyle.card, styles.stat]}>
            <Text style={styles.statValue}>{card.sentences.length}</Text>
            <Text style={styles.statLabel}>Sentences</Text>
          </View>
          <View style={[GlassStyle.card, styles.stat]}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{card.scores.totalEarned}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={[GlassStyle.card, styles.stat]}>
            <Text style={styles.statValue}>4:12</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        <Pressable style={styles.reviewBtn} onPress={onRestart}>
          <Text style={styles.reviewBtnText}>Review Again</Text>
        </Pressable>
        <Pressable style={[GlassStyle.card, styles.backBtn]} onPress={onExit}>
          <Text style={styles.backBtnText}>Back to Sets</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 150,
    zIndex: -1,
  },
  c1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.deco1,
    top: -80,
    left: -80,
  },
  c2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.deco2,
    bottom: -40,
    right: -60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  trophy: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  stat: {
    padding: 20,
    alignItems: 'center',
    minWidth: 90,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  reviewBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  reviewBtnText: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.textLight,
  },
  backBtn: {
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
  },
});
