import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, GlassStyle } from '@/constants/Colors';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const CARDS = [
  { hebrew: 'שלום', transliteration: '(sha-lom)', translation: 'Hello / Peace', hint: 'Common greeting used at any time of day' },
  { hebrew: 'תודה', transliteration: '(to-da)', translation: 'Thank you', hint: 'Expression of gratitude' },
  { hebrew: 'בוקר טוב', transliteration: '(bo-ker tov)', translation: 'Good morning', hint: 'Morning greeting' },
  { hebrew: 'מים', transliteration: '(ma-yim)', translation: 'Water', hint: 'Essential vocabulary' },
];

export default function LearnScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const flipProgress = useSharedValue(0);

  const card = CARDS[currentIndex];

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden' as const,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden' as const,
  }));

  function handleFlip() {
    const target = isFlipped ? 0 : 1;
    flipProgress.value = withTiming(target, { duration: 400 });
    setIsFlipped(!isFlipped);
  }

  function handleNext() {
    if (currentIndex < CARDS.length - 1) {
      flipProgress.value = 0;
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionComplete(true);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      flipProgress.value = 0;
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  }

  if (sessionComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <View style={styles.completeContainer}>
          <View style={[GlassStyle.cardStrong, styles.trophy]}>
            <Ionicons name="trophy" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.completeTitle}>Session Complete!</Text>
          <Text style={styles.completeSubtitle}>Great job! You're making progress.</Text>

          <View style={styles.completeStats}>
            <View style={[GlassStyle.card, styles.completeStat]}>
              <Text style={styles.completeStatValue}>{CARDS.length}</Text>
              <Text style={styles.completeStatLabel}>Cards</Text>
            </View>
            <View style={[GlassStyle.card, styles.completeStat]}>
              <Text style={[styles.completeStatValue, { color: Colors.primary }]}>840</Text>
              <Text style={styles.completeStatLabel}>Score</Text>
            </View>
            <View style={[GlassStyle.card, styles.completeStat]}>
              <Text style={styles.completeStatValue}>5:32</Text>
              <Text style={styles.completeStatLabel}>Time</Text>
            </View>
          </View>

          <Pressable style={styles.reviewBtn} onPress={() => { setSessionComplete(false); setCurrentIndex(0); }}>
            <Text style={styles.reviewBtnText}>Review Again</Text>
          </Pressable>
          <Pressable style={[GlassStyle.card, styles.backToSetsBtn]} onPress={() => router.back()}>
            <Text style={styles.backToSetsBtnText}>Back to Sets</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[GlassStyle.card, styles.closeBtn]}>
          <Ionicons name="close" size={22} color={Colors.text} />
        </Pressable>
        <View style={[GlassStyle.card, styles.progressBar]}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / CARDS.length) * 100}%` }]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{CARDS.length}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
          <Text style={styles.hebrewText}>{card.hebrew}</Text>
          <Text style={styles.transliteration}>{card.transliteration}</Text>
          <Pressable style={styles.audioBtn}>
            <Ionicons name="play" size={20} color={Colors.textLight} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
          <Text style={styles.translationTitle}>{card.translation}</Text>
          <Text style={styles.hint}>{card.hint}</Text>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[GlassStyle.card, styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? Colors.textSecondary : Colors.text} />
        </Pressable>

        <Pressable style={styles.flipBtn} onPress={handleFlip}>
          <Ionicons name="refresh" size={20} color={Colors.textLight} />
          <Text style={styles.flipBtnText}>Flip</Text>
        </Pressable>

        <Pressable style={[GlassStyle.card, styles.navBtn]} onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color={Colors.text} />
        </Pressable>
      </View>

      <View style={[GlassStyle.card, styles.bottomActions]}>
        <Pressable style={styles.actionItem}>
          <Ionicons name="refresh" size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Repeat</Text>
        </Pressable>
        <Pressable style={styles.actionItem}>
          <Ionicons name="heart-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Favorite</Text>
        </Pressable>
        <Pressable style={styles.actionItem}>
          <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Note</Text>
        </Pressable>
        <View style={styles.actionItem}>
          <Ionicons name="star" size={18} color={Colors.primary} />
          <Text style={styles.actionText}>2.0</Text>
        </View>
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
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(196, 113, 43, 0.06)',
    top: -80,
    left: -80,
    zIndex: -1,
  },
  bgCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(232, 164, 92, 0.05)',
    bottom: -40,
    right: -60,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    padding: 0,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  counter: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    height: 340,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 24,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: Colors.primary,
  },
  cardBack: {
    backgroundColor: Colors.primaryLight,
  },
  hebrewText: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.textLight,
  },
  transliteration: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  audioBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  translationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textLight,
    textAlign: 'center',
  },
  hint: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  flipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  flipBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    borderRadius: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  completeContainer: {
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
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  completeSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 32,
  },
  completeStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  completeStat: {
    padding: 20,
    alignItems: 'center',
    minWidth: 90,
  },
  completeStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  completeStatLabel: {
    fontSize: 13,
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
    color: Colors.textLight,
  },
  backToSetsBtn: {
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
  },
  backToSetsBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
});
