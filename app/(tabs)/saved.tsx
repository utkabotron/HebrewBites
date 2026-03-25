import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlassStyle } from '@/constants/Colors';
import { useState } from 'react';

const FAVORITES = [
  { id: '1', hebrew: 'שלום', translation: 'Hello / Peace', level: 'mastered' },
  { id: '2', hebrew: 'תודה', translation: 'Thank you', level: 'advanced' },
  { id: '3', hebrew: 'בוקר', translation: 'Morning', level: 'intermediate' },
  { id: '4', hebrew: 'מים', translation: 'Water', level: 'beginner' },
];

const levelColors: Record<string, string> = {
  mastered: Colors.badge.mastered,
  advanced: Colors.badge.advanced,
  intermediate: Colors.badge.intermediate,
  beginner: Colors.badge.beginner,
};

export default function SavedScreen() {
  const [tab, setTab] = useState<'favorites' | 'notes'>('favorites');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />

      <Text style={styles.title}>Collections</Text>

      <View style={[GlassStyle.card, styles.tabs]}>
        <Pressable
          style={[styles.tab, tab === 'favorites' && styles.tabActive]}
          onPress={() => setTab('favorites')}
        >
          <Text style={[styles.tabText, tab === 'favorites' && styles.tabTextActive]}>Favorites</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'notes' && styles.tabActive]}
          onPress={() => setTab('notes')}
        >
          <Text style={[styles.tabText, tab === 'notes' && styles.tabTextActive]}>Notes</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {tab === 'favorites' ? (
          FAVORITES.map((item) => (
            <View key={item.id} style={[GlassStyle.card, styles.wordCard]}>
              <View>
                <Text style={styles.hebrew}>{item.hebrew}</Text>
                <Text style={styles.translation}>{item.translation}</Text>
              </View>
              <View style={styles.wordRight}>
                <View style={[styles.levelBadge, { backgroundColor: levelColors[item.level] }]}>
                  <Text style={styles.levelText}>{item.level.toUpperCase()}</Text>
                </View>
                <Ionicons name="heart" size={20} color={Colors.primary} />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={[GlassStyle.cardStrong, styles.emptyIcon]}>
              <Ionicons name="document-text-outline" size={40} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>Add notes while learning to see them here</Text>
          </View>
        )}
      </ScrollView>
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
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(196, 113, 43, 0.06)',
    top: -40,
    right: -100,
    zIndex: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 20,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: Colors.glass.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
  },
  scroll: {
    paddingBottom: 120,
  },
  wordCard: {
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hebrew: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  translation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  wordRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
