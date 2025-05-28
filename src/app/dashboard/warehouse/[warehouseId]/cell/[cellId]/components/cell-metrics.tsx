"use client";
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { CellMetric } from '@/dto/cell-metric.dto';
import { socket } from '@/socket';
import { IconTrendingUp } from '@tabler/icons-react';
import {
  ThermometerIcon,
  Calendar1Icon,
  DropletIcon,
  CloudIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function CellMetrics(): React.ReactElement {
  const [metrics, setMetric] = useState<CellMetric[]>([]);

  const displayValue = (value?: number, unit: string = ''): string => {
    return value !== undefined ? `${value}${unit}` : 'N/A';
  };

  const displayDifference = (values: (number | undefined)[], unit: string = ''): string => {
    if (values.length < 2) {
      return 'N/A';
    }
    if (values[0] === undefined || values[1] === undefined) {
      return 'N/A';
    }

    const diff = values[0] - values[1];
    return `${diff >= 0 ? '+' : ''}${diff}${unit}`;
  };

  useEffect(() => {
    const metricsHandler = (data: CellMetric) => {
      setMetric((current) => {
        const newMetrics: CellMetric[] = [...current];
        newMetrics.unshift(data);
        if (newMetrics.length > 2) {
          newMetrics.pop();
        }
        return newMetrics;
      });
    }
    socket.on("metrics", metricsHandler);
    () => {
      socket.off("metrics", metricsHandler)
    }
  }, []);

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card mb-8 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      <Card className='@container/card h-32'>
        <CardHeader className='flex h-36 items-center justify-center'>
          <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
            <ThermometerIcon className='h-8 w-8 text-green-700' />
          </div>

          <div className='flex flex-1 flex-col gap-y-1'>
            <CardDescription className='text-xs'>temperature</CardDescription>
            <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
              {displayValue(metrics.length > 0 ? metrics[0].temperature : undefined, '°C')}
            </CardTitle>
            <CardAction className='mt-2'>
              <Badge variant='outline' className='flex items-center'>
                <IconTrendingUp className='h-4 w-4' />
                {displayDifference(metrics.map((metric) => metric.temperature), '°C')}
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
      </Card>

      <Card className='@container/card h-32'>
        <CardHeader className='flex h-36 items-center justify-center gap-4'>
          <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
            <DropletIcon className='h-8 w-8 text-green-700' />
          </div>

          <div className='flex flex-1 flex-col gap-y-1'>
            <CardDescription className='text-xs'>humidity</CardDescription>
            <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
              {displayValue(metrics.length > 0 ? metrics[0].humidity : undefined, '%')}
            </CardTitle>
            <CardAction className='mt-2'>
              <Badge variant='outline' className='flex items-center gap-1'>
                <IconTrendingUp className='h-4 w-4' />
                {displayDifference(metrics.map((metric) => metric.humidity), '%')}
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
      </Card>

      <Card className='@container/card h-32'>
        <CardHeader className='flex h-36 items-center justify-center gap-2'>
          <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
            <CloudIcon className='h-8 w-8 text-green-700' />
          </div>

          <div className='flex flex-1 flex-col gap-y-1'>
            <CardDescription className='text-xs'>CO2 level</CardDescription>
            <CardTitle className='text-xl font-bold tabular-nums @[250px]/card:text-2xl'>
              {displayValue(metrics.length > 0 ? metrics[0].co2 : undefined, 'ppm')}
            </CardTitle>
            <CardAction className='mt-2'>
              <Badge variant='outline' className='flex items-center gap-1'>
                <IconTrendingUp className='h-4 w-4' />
                {displayDifference(metrics.map((metric) => metric.co2), 'ppm')}
              </Badge>
            </CardAction>
          </div>
        </CardHeader>
      </Card>

      <Card className='@container/card h-32'>
        <CardHeader className='flex h-36 items-center justify-center gap-4'>
          <div className='mr-2 flex h-14 w-14 items-center justify-center rounded-lg border border-green-500 bg-green-100'>
            <Calendar1Icon className='h-7 w-7 text-green-700' />
          </div>

          <div className='flex flex-1 flex-col gap-y-1'>
            <CardDescription className='text-xs'>session</CardDescription>
            <CardTitle className='text-lg font-bold tabular-nums @[250px]/card:text-2xl'>
              24<div className='text-sm font-normal'>days passed</div>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
