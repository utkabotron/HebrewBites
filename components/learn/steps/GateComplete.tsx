import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, GlassStyle } from '@/constants/Colors';
import type { LearnCard } from '@/constants/learnTypes';
import { Icon } from '@/components/ui/Icon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScoreCard } from './ScoreCard';

export interface GateProps {
  card: LearnCard;
  onFinish: () => void;
  onContinue: () => void;
}

export function GateComplete({ card, onFinish, onContinue }: GateProps) {
  return (
    <>
      <View style={styles.celeb}>
        <View style={[GlassStyle.cardStrong, styles.trophy]}>
          <Icon name="trophy" size={40} color={Colors.success} />
        </View>
        <Text style={styles.title}>Обязательная часть выполнена!</Text>
        <Text style={styles.subtitle}>You completed the core learning cycle</Text>
      </View>

      <ScoreCard card={card} />

      <PrimaryButton label="Завершить карточку" onPress={onFinish} height={52} />

      <View style={styles.orWrap}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>или</Text>
        <View style={styles.orLine} />
      </View>

      <View style={[GlassStyle.card, styles.contCard]}>
        <Text style={styles.contTitle}>Получить больше баллов и награды</Text>
        <Text style={styles.contSub}>Complete sides 3–4 for up to 220 more points</Text>
        <PrimaryButton
          label="Продолжить"
          onPress={onContinue}
          variant="outline"
          height={44}
          style={styles.contBtn}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  celeb: {
    alignItems: 'center',
    gap: 16,
  },
  trophy: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  orWrap: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  orText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  contCard: {
    padding: 20,
    gap: 12,
    alignItems: 'center',
  },
  contTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  contSub: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  contBtn: {
    width: '100%',
  },
});
