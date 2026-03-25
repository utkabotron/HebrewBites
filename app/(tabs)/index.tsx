import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlassStyle } from '@/constants/Colors';

function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[GlassStyle.card, style]}>
      {children}
    </View>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <GlassCard style={styles.statCard}>
      <View style={styles.statIconBg}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassCard>
  );
}

function SetCard({ title, count, isFree }: { title: string; count: number; isFree: boolean }) {
  return (
    <Pressable onPress={() => router.push('/set/1')}>
      <GlassCard style={styles.setCard}>
        <View style={styles.setCardIcon}>
          <Text style={styles.setCardIconText}>א</Text>
        </View>
        <Text style={styles.setCardTitle}>{title}</Text>
        <View style={styles.setCardFooter}>
          <Text style={styles.setCardCount}>{count} cards</Text>
          <View style={[styles.badge, { backgroundColor: isFree ? Colors.badge.free : Colors.badge.paid }]}>
            <Text style={styles.badgeText}>{isFree ? 'FREE' : 'PAID'}</Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Shalom, David!</Text>
        <Text style={styles.subtitle}>Keep up your learning streak</Text>

        <View style={styles.statsGrid}>
          <StatCard icon="flame-outline" value="12" label="Day Streak" />
          <StatCard icon="book-outline" value="86" label="Cards Learned" />
          <StatCard icon="star-outline" value="1,240" label="Total Score" />
          <StatCard icon="time-outline" value="3" label="Sessions Today" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <Pressable onPress={() => router.push('/catalog')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.setsRow}>
          <SetCard title="Alef-Bet Basics" count={24} isFree />
          <SetCard title="Daily Verbs" count={32} isFree={false} />
        </ScrollView>
      </ScrollView>

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(196, 113, 43, 0.08)',
    top: -80,
    right: -80,
    zIndex: -1,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 164, 92, 0.06)',
    bottom: 100,
    left: -60,
    zIndex: -1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    padding: 16,
    width: '47%',
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(196, 113, 43, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  setsRow: {
    marginHorizontal: -4,
  },
  setCard: {
    padding: 16,
    width: 160,
    marginHorizontal: 6,
  },
  setCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(196, 113, 43, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  setCardIconText: {
    fontSize: 24,
    color: Colors.primary,
  },
  setCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  setCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setCardCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textLight,
  },
});
