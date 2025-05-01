import PageContainer from '@/components/layout/page-container';
import React from 'react';
import Commands from '@/features/overview/components/commands';
import CO2AreaChart from '@/features/overview/components/area-graph';
import { ConnectedStatus } from './components/connected-status';
import { CellMetrics } from './components/cell-metrics';
import { CELL_ID } from '@/constants/mqtt';
export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col pb-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='mb-4 text-2xl font-bold tracking-tight'>
            Cell Dashboard
          </h2>
          { /*<ConnectedStatus cellId='1e4c29f9-9f13-46c5-9da0-5f6fe251dd53'/> */ }
          <ConnectedStatus cellId={CELL_ID} />
        </div>

        <CellMetrics />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-10'>{bar_stats}</div>
          <div className='col-span-10 mt-4 rounded-xl bg-[var(--card)] shadow-xs'>
            <Commands cellId={CELL_ID} />
          </div>
          <div className='col-span-10 mt-4 rounded-xl bg-[var(--card)] shadow-xs'>
            <CO2AreaChart cellId={CELL_ID} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
