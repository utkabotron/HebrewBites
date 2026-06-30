import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import type { Accent } from '@/constants/learnTypes';
import { SessionHeader } from './SessionHeader';
import { ProgressBar } from './ProgressBar';

export interface SessionFrameProps {
  accent?: Accent;
  title?: string;          // when set → render SessionHeader
  progress?: number;       // 0..1, when set → render ProgressBar
  onBack?: () => void;
  onClose?: () => void;
  scroll?: boolean;        // default true
  contentStyle?: object;
  children: React.ReactNode;
}

// Shared session chrome: SafeArea + decorative circles + header + progress + body.
// The "hrome" is drawn once; step bodies swap inside the content slot.
export function SessionFrame({
  accent = 'mandatory',
  title,
  progress,
  onBack,
  onClose,
  scroll = true,
  contentStyle,
  children,
}: SessionFrameProps) {
  const bonus = accent === 'bonus';

  const top = (
    <View style={styles.topArea}>
      {onBack && onClose && (
        <SessionHeader title={title ?? ''} onBack={onBack} onClose={onClose} />
      )}
      {progress != null && (
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} accent={accent} />
        </View>
      )}
    </View>
  );

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.nonScrollContent, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Decorative warm circles — background motif */}
      <View style={[styles.circle, { width: 220, height: 220, borderRadius: 110, top: -60, left: -60, backgroundColor: bonus ? Colors.deco2 : Colors.deco1 }]} />
      <View style={[styles.circle, { width: 180, height: 180, borderRadius: 90, top: 140, right: -70, backgroundColor: bonus ? Colors.deco1 : Colors.deco2 }]} />
      <View style={[styles.circle, { width: 200, height: 200, borderRadius: 100, bottom: -40, left: 40, backgroundColor: Colors.deco2 }]} />

      <View style={styles.inner}>
        {top}
        {body}
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
    zIndex: -1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topArea: {
    paddingTop: 8,
    gap: 16,
  },
  progressWrap: {
    marginBottom: 4,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },
  nonScrollContent: {
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },
});
