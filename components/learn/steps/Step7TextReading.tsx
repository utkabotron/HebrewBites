import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Badge } from '@/components/ui/Badge';
import { HebrewText } from '@/components/ui/HebrewText';
import { AudioButton } from '@/components/ui/AudioButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Waveform } from './Waveform';
import { CountdownCircle } from './CountdownCircle';

export interface Step7Props {
  card: LearnCard;
  onNext: () => void;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Step7TextReading({ card, onNext }: Step7Props) {
  const p = card.paragraph;
  return (
    <>
      <Badge label="BONUS: Speech & Automation" variant="amber" icon="star" letterSpacing={0.3} />

      <View style={styles.titleSection}>
        <Text style={styles.title}>Read &amp; Listen</Text>
        <Text style={styles.subtitle}>Study this text, then reproduce it</Text>
      </View>

      <View style={[GlassStyle.cardStrong, styles.card]}>
        <HebrewText preset="paragraph" color={Colors.text} style={styles.paragraph}>
          {p.hebrew}
        </HebrewText>
      </View>

      <View style={styles.audioRow}>
        <AudioButton icon="play" filled size={48} />
        <Waveform />
        <Text style={styles.duration}>0:00 / {fmt(p.durationSec)}</Text>
      </View>

      <View style={styles.timerRow}>
        <CountdownCircle />
        <Text style={styles.timerLabel}>Time remaining: {fmt(p.readSec)}</Text>
      </View>

      <PrimaryButton label="Ready" onPress={onNext} variant="amber" />
    </>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    gap: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  card: {
    borderRadius: 20,
    padding: 24,
  },
  paragraph: {
    width: '100%',
  },
  audioRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  duration: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  timerRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
});
