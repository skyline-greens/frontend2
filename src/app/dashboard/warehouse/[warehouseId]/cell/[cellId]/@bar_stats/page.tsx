import { delay } from '@/constants/mock-api';
import { LineGraph } from '@/features/overview/components/bar-graph';

export default async function BarStats({ params }: { params: Promise<{ cellId: string }> }) {
  await delay(1000);
  const { cellId } = await params;

  return <LineGraph cellId={cellId} />;
}
