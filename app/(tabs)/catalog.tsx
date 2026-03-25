import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlassStyle } from '@/constants/Colors';
import { useState } from 'react';

const SETS = [
  { id: '1', title: 'Alef-Bet Basics', count: 24, isFree: true },
  { id: '2', title: 'Food & Drinks', count: 18, isFree: true },
  { id: '3', title: 'Daily Verbs', count: 32, isFree: false },
  { id: '4', title: 'Colors & Numbers', count: 20, isFree: true },
  { id: '5', title: 'Travel Hebrew', count: 28, isFree: false },
  { id: '6', title: 'Family & People', count: 15, isFree: true },
];

type Filter = 'all' | 'free' | 'premium';

export default function CatalogScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = SETS.filter((s) => {
    if (filter === 'free' && !s.isFree) return false;
    if (filter === 'premium' && s.isFree) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Card Sets</Text>

        <View style={[GlassStyle.card, styles.searchBox]}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search card sets..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filters}>
          {(['all', 'free', 'premium'] as Filter[]).map((f) => (
            <Pressable
              key={f}
              style={[
                GlassStyle.card,
                styles.filterBtn,
                filter === f && styles.filterBtnActive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.grid}>
          {filtered.map((set) => (
            <Pressable
              key={set.id}
              style={[GlassStyle.card, styles.card]}
              onPress={() => router.push(`/set/${set.id}`)}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>א</Text>
              </View>
              <Text style={styles.cardTitle}>{set.title}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardCount}>{set.count} cards</Text>
                <View style={[styles.badge, { backgroundColor: set.isFree ? Colors.badge.free : Colors.badge.paid }]}>
                  <Text style={styles.badgeText}>{set.isFree ? 'FREE' : 'PAID'}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(196, 113, 43, 0.07)',
    top: 60,
    left: -80,
    zIndex: -1,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 164, 92, 0.06)',
    bottom: 150,
    right: -60,
    zIndex: -1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: Colors.text,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.textLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    padding: 16,
    width: '47%',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(196, 113, 43, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 24,
    color: Colors.primary,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCount: {
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
