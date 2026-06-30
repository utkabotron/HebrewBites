import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import type { Accent } from '@/constants/learnTypes';

export interface ProgressBarProps {
  // 0..1 fraction filled.
  progress: number;
  accent?: Accent;
}

// Track + fill. Mandatory accent = solid primary; bonus accent = amber gradient.
export function ProgressBar({ progress, accent = 'mandatory' }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(1, progress)) * 100}%` as const;
  const bonus = accent === 'bonus';
  return (
    <View style={[styles.track, { backgroundColor: bonus ? Colors.amberTrack : Colors.progressTrack }]}>
      <View style={[styles.fillWrap, { width }]}>
        {bonus ? (
          <LinearGradient
            colors={Colors.gradients.amberProgress}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        ) : (
          <View style={[styles.fill, { backgroundColor: Colors.primary }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillWrap: {
    height: '100%',
  },
  fill: {
    flex: 1,
    borderRadius: 3,
  },
});
