import { delay } from '@/constants/mock-api';
import { LineGraph } from '@/features/overview/components/bar-graph';

export default async function BarStats({ params }: { params: { cellId: string } }) {
  await delay(1000);

  return <LineGraph cellId={params.cellId} />;
}