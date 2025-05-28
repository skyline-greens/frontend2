import { delay } from '@/constants/mock-api';
import { CELL_ID } from '@/constants/mqtt';
import { LineGraph } from '@/features/overview/components/bar-graph';

export default async function BarStats() {
  await await delay(1000);

  return <LineGraph cellId={CELL_ID!} />;
}
