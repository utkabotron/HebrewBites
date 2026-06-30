import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { DropSlot } from './DropSlot';
import { DragCard } from './DragCard';

export interface Step8Props {
  card: LearnCard;
  onNext: () => void;
}

// Fixed scrambled presentation order of the 4 sentences (indices into orderSentences).
const START_REMAINING = [1, 3, 0, 2];

export function Step8SentenceOrder({ card, onNext }: Step8Props) {
  const order = card.orderSentences;
  // slots[i] = sentence index placed in slot i, or null.
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null, null]);
  const [remaining, setRemaining] = useState<number[]>(START_REMAINING);

  const placeCard = (sentenceIdx: number) => {
    const empty = slots.findIndex((s) => s === null);
    if (empty === -1) return;
    const next = [...slots];
    next[empty] = sentenceIdx;
    setSlots(next);
    setRemaining(remaining.filter((r) => r !== sentenceIdx));
  };

  const removeFromSlot = (slotIdx: number) => {
    const sentenceIdx = slots[slotIdx];
    if (sentenceIdx === null) return;
    const next = [...slots];
    next[slotIdx] = null;
    setSlots(next);
    setRemaining([...remaining, sentenceIdx]);
  };

  return (
    <>
      <Text style={styles.stageLabel}>Stage 1 of 2</Text>
      <Text style={styles.title}>Arrange the sentences in correct order</Text>
      <Text style={styles.subtitle}>Tap a sentence to place it, tap a slot to remove it</Text>

      <View style={styles.dropZone}>
        {slots.map((sentenceIdx, i) => (
          <DropSlot
            key={i}
            position={i + 1}
            hebrew={sentenceIdx === null ? null : order[sentenceIdx]}
            onPress={() => removeFromSlot(i)}
          />
        ))}
      </View>

      {remaining.length > 0 && (
        <>
          <Text style={styles.remainLabel}>Remaining</Text>
          <View style={styles.remainSection}>
            {remaining.map((sentenceIdx) => (
              <DragCard
                key={sentenceIdx}
                hebrew={order[sentenceIdx]}
                onPress={() => placeCard(sentenceIdx)}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.bottom}>
        <PrimaryButton label="Check Order" onPress={onNext} variant="amber" height={54} style={styles.checkBtn} />
        <View style={styles.ptsBadge}>
          <Icon name="star" size={14} color={Colors.secondary} />
          <Text style={styles.ptsText}>+20 pts</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  stageLabel: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dropZone: {
    gap: 10,
  },
  remainLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.textSecondary,
  },
  remainSection: {
    gap: 10,
  },
  bottom: {
    gap: 12,
    alignItems: 'center',
    paddingTop: 8,
  },
  checkBtn: {
    width: '100%',
  },
  ptsBadge: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFF3E0',
  },
  ptsText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
});
