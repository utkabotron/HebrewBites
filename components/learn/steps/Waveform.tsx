import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const PLAYED = [8, 18, 12, 24, 14, 20, 10, 28, 16, 22, 10, 26];
const UNPLAYED = [14, 20, 8, 24, 12, 18, 10, 22];

// Static audio waveform: amber "played" bars + muted "unplayed" bars (visual only).
export function Waveform() {
  return (
    <View style={styles.row}>
      {PLAYED.map((h, i) => (
        <View key={`p${i}`} style={[styles.bar, { height: h, backgroundColor: Colors.secondary }]} />
      ))}
      {UNPLAYED.map((h, i) => (
        <View key={`u${i}`} style={[styles.bar, { height: h, backgroundColor: Colors.amberTrack }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
