"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DropletIcon, CloudIcon, FlameIcon } from 'lucide-react';

type WarehouseStats = {
  nutrients: string;
  water: string;
  energy: string;
};

export function WarehouseStatsCards({ stats }: { stats: WarehouseStats }) {
  return (
    <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Nutrients */}
      <Card className='@container/card h-36'>
        <CardHeader className='h-full flex flex-col items-start justify-start gap-4 p-2'>
          <div className="flex items-center gap-2">
            <CloudIcon className='h-6 w-6 text-green-700' />
            <CardTitle className="text-lg font-semibold">Nutrients</CardTitle>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tabular-nums">{stats.nutrients ?? 'N/A'}</span>
            <span className="text-base font-normal text-muted-foreground">mg/L</span>
          </div>
          <CardDescription className='text-xs mt-1'>
            Total nutrients consumed last month
          </CardDescription>
        </CardHeader>
      </Card>
      {/* Water */}
      <Card className='@container/card h-36'>
        <CardHeader className='h-full flex flex-col items-start justify-start gap-4 p-2'>
          <div className="flex items-center gap-2">
            <DropletIcon className='h-6 w-6 text-blue-700' />
            <CardTitle className="text-lg font-semibold">Water</CardTitle>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tabular-nums">{stats.water ?? 'N/A'}</span>
            <span className="text-base font-normal text-muted-foreground">Liters</span>
          </div>
          <CardDescription className='text-xs mt-1'>
            Total water consumed last month
          </CardDescription>
        </CardHeader>
      </Card>
      {/* Energy */}
      <Card className='@container/card h-36'>
        <CardHeader className='h-full flex flex-col items-start justify-start gap-4 p-2'>
          <div className="flex items-center gap-2">
            <FlameIcon className='h-6 w-6 text-orange-700' />
            <CardTitle className="text-lg font-semibold">Energy</CardTitle>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold tabular-nums">{stats.energy ?? 'N/A'}</span>
            <span className="text-base font-normal text-muted-foreground">kWh</span>
          </div>
          <CardDescription className='text-xs mt-1'>
            Total energy consumed last month
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}