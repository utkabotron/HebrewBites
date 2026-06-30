import { useLocalSearchParams } from 'expo-router';
import { LearnSession } from '@/components/learn/LearnSession';
import { getLearnCard } from '@/constants/learnData';

export default function LearnScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const card = getLearnCard(setId);
  return <LearnSession card={card} />;
}
