import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

// Single upgrade point: the designs reference Lucide icon names. We map them to
// Ionicons today. To switch to real Lucide later, install lucide-react-native +
// react-native-svg and swap the implementation here — screens stay untouched.
const LUCIDE_TO_IONICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  'chevron-left': 'chevron-back',
  'arrow-left': 'arrow-back',
  x: 'close',
  'volume-2': 'volume-high',
  play: 'play',
  star: 'star',
  trophy: 'trophy',
  sparkles: 'sparkles',
  pencil: 'pencil',
  mic: 'mic',
  'pen-line': 'create-outline',
  puzzle: 'extension-puzzle',
  headphones: 'headset',
  keyboard: 'keypad-outline',
  'grid-2x2': 'grid',
  'grip-vertical': 'reorder-three',
  timer: 'timer-outline',
  languages: 'language',
  globe: 'globe-outline',
  check: 'checkmark',
};

export interface IconProps {
  name: string; // Lucide name
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = Colors.text }: IconProps) {
  const mapped = LUCIDE_TO_IONICON[name] ?? 'help-outline';
  return <Ionicons name={mapped} size={size} color={color} />;
}
