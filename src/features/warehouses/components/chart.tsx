'use client';
import dynamic from 'next/dynamic';


const TemperatureLineChart = dynamic(() => import('./wh-line-graph'), { ssr: false });
const HumidityLineChart = dynamic(() => import('./wh-humidity'), { ssr: false });




export default function LineChart({ warehouseId }: { warehouseId: string }) {
 return ( <>
<HumidityLineChart warehouseId={warehouseId} />
<TemperatureLineChart warehouseId={warehouseId} />
{/* <ConsumptionLineChart warehouseId={warehouseId} /> */}

</>
  );
}