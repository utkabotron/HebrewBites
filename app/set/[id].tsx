import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlassStyle } from '@/constants/Colors';

const MODES = [
  { key: 'sequential', icon: 'arrow-forward', label: 'Sequential' },
  { key: 'random', icon: 'shuffle', label: 'Random' },
  { key: 'adaptive', icon: 'bulb-outline', label: 'Adaptive' },
  { key: 'review', icon: 'refresh', label: 'Review' },
];

export default function SetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[GlassStyle.card, styles.backBtn]}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Set Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[GlassStyle.cardStrong, styles.iconBox]}>
        <Text style={styles.iconText}>א</Text>
      </View>

      <Text style={styles.title}>Alef-Bet Basics</Text>
      <Text style={styles.description}>
        Learn the Hebrew alphabet with essential vocabulary. Master letters, vowels, and basic words.
      </Text>

      <View style={[GlassStyle.card, styles.stats]}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Cards</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.primary }]}>45%</Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.badge.free }]}>FREE</Text>
          <Text style={styles.statLabel}>Price</Text>
        </View>
      </View>

      <Text style={styles.modeTitle}>Learning Mode</Text>
      <View style={styles.modes}>
        {MODES.map((mode, i) => (
          <Pressable
            key={mode.key}
            style={[GlassStyle.card, styles.modeBtn, i === 0 && styles.modeBtnActive]}
          >
            <Ionicons
              name={mode.icon as any}
              size={20}
              color={i === 0 ? Colors.textLight : Colors.textSecondary}
            />
            <Text style={[styles.modeLabel, i === 0 && styles.modeLabelActive]}>
              {mode.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.startBtn}
        onPress={() => router.push(`/learn/${id}`)}
      >
        <Text style={styles.startBtnText}>Start Learning</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(196, 113, 43, 0.08)',
    top: -100,
    right: -60,
    zIndex: -1,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 164, 92, 0.06)',
    bottom: 80,
    left: -80,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    marginBottom: 28,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  modes: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  modeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeLabelActive: {
    color: Colors.textLight,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textLight,
  },
});
