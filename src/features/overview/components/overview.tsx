'use client';
import CO2AreaChart from './area-graph';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { IconTrendingUp } from '@tabler/icons-react';
import React from 'react';
import {
  ThermometerIcon,
  Calendar1Icon,
  DropletIcon,
  CloudIcon
} from 'lucide-react';
import Commands from '@/features/overview/components/commands';
import { CELL_ID } from '@/constants/mqtt';

export default function OverViewLayout({
  bar_stats,
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='mb-4 text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card
            className='from-primary/5 to-card dark:bg-card @container/card h-36 bg-gradient-to-t shadow-xs'
            data-slot='card'
          >
            <CardHeader className='flex h-32 items-center justify-center'>
              <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
                <ThermometerIcon className='h-8 w-8 text-green-700' />
              </div>

              <div className='flex flex-1 flex-col gap-y-1'>
                <CardDescription className='text-xs'>
                  temperature
                </CardDescription>
                <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
                  23°C
                </CardTitle>
                <CardAction className='mt-2'>
                  <Badge variant='outline' className='flex items-center'>
                    <IconTrendingUp className='h-4 w-4' />
                    +4°C
                  </Badge>
                </CardAction>
              </div>
            </CardHeader>
          </Card>

          <Card
            className='from-primary/5 to-card dark:bg-card @container/card h-32 bg-gradient-to-t shadow-xs'
            data-slot='card'
          >
            <CardHeader className='flex h-36 items-center justify-center gap-4'>
              <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
                <DropletIcon className='h-8 w-8 text-green-700' />
              </div>

              <div className='flex flex-1 flex-col gap-y-1'>
                <CardDescription className='text-xs'>humidity</CardDescription>
                <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
                  19%
                </CardTitle>
                <CardAction className='mt-2'>
                  <Badge variant='outline' className='flex items-center gap-1'>
                    <IconTrendingUp className='h-4 w-4' />
                    +2%
                  </Badge>
                </CardAction>
              </div>
            </CardHeader>
          </Card>

          <Card
            className='from-primary/5 to-card dark:bg-card @container/card h-32 bg-gradient-to-t shadow-xs'
            data-slot='card'
          >
            <CardHeader className='flex h-32 items-center justify-center gap-2'>
              <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
                <CloudIcon className='h-8 w-8 text-green-700' />
              </div>

              <div className='flex flex-1 flex-col gap-y-1'>
                <CardDescription className='text-xs'>CO2 level</CardDescription>
                <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
                  450 ppm
                </CardTitle>
                <CardAction className='mt-2'>
                  <Badge variant='outline' className='flex items-center gap-1'>
                    <IconTrendingUp className='h-4 w-4' />
                    +45 ppm
                  </Badge>
                </CardAction>
              </div>
            </CardHeader>
          </Card>

          <Card
            className='from-primary/5 to-card dark:bg-card @container/card h-32 bg-gradient-to-t shadow-xs'
            data-slot='card'
          >
            <CardHeader className='flex h-32 items-center justify-center gap-4'>
              <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
                <Calendar1Icon className='h-7 w-7 text-green-700' />
              </div>

              <div className='flex flex-1 flex-col gap-y-1'>
                <CardDescription className='text-xs'>session</CardDescription>
                <CardTitle className='text-lg font-bold tabular-nums @[250px]/card:text-2xl'>
                  24<div className='text-sm font-normal'>days left</div>
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>

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
