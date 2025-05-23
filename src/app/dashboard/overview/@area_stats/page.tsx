import { delay } from '@/constants/mock-api';
import { CELL_ID } from '@/constants/mqtt';
import CO2AreaChart from '@/features/overview/components/area-graph';

export default async function AreaStats() {
  await await delay(2000);
  return <CO2AreaChart cellId={CELL_ID} />;
}
