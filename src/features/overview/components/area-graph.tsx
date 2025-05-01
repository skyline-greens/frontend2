'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TimeRangeSelector } from '@/features/overview/TimeRangeSelector';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fetchMetrics, Metric } from './api';
import { socket } from '@/socket';
import { appendWithMaxLength } from '@/helpers/general';


export default function CO2AreaChart({ cellId }: { cellId: string }) {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [data, setData] = useState<Metric[]>([]);
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!realtimeMode) {
      fetchMetrics({
        cellId: cellId,
        timeRange: timeRange,
        selectedYear: selectedYear,
        selectedMonth: selectedMonth,
        selectedDay: selectedDay,
        setData,
        baseUrl: 'http://localhost:8000',
      });
    } else {
      const metricHandler = (metric: any) => {
        setData((old) => appendWithMaxLength(old, {
          ...metric,
          air: metric.airPump == 1, 
          water: metric.waterPump == 1,
          light: metric.light == 1,
          cellId,
          date: new Date().toString(),
        }));
      }

      socket.on("metrics", metricHandler);
      console.log("CO2 metric handler loaded");
      return () => {
        socket.off("metrics", metricHandler);
        setData([]);
      }
    }
  }, [cellId, timeRange, selectedYear, selectedMonth, selectedDay, realtimeMode]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => 2023 + i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const formatXAxis = (value: string) => {
    if (realtimeMode) {
      const date = new Date(value);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    if (timeRange === 'day') {
      const date = new Date(value);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
    } else {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        month: timeRange === 'year' ? 'short' : undefined,
        day: 'numeric'
      });
    }
  };

  const formatTooltipLabel = (value: string) => {
    const date = new Date(value);
    if (timeRange === 'day' || realtimeMode) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: realtimeMode ? 'numeric' : undefined,
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Card className='h-full @container/card rounded-xl bg-white shadow-lg'>
      <CardHeader className='flex flex-col items-start justify-between border-b border-gray-100 p-6 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle className='text-2xl font-bold text-gray-800'>
            CO₂ Levels Monitoring
          </CardTitle>
          <CardDescription className='text-gray-500'>
            Atmospheric carbon dioxide concentration (ppm) over time
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-2 pb-6 sm:flex-row sm:items-center sm:justify-between'>
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            className='w-full sm:w-auto'
            disabled={realtimeMode}
          />
          <div className='grid grid-cols-3 gap-2 sm:flex sm:gap-2'>
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(Number(val))}
              disabled={realtimeMode}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Year' />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {timeRange !== 'year' && (
              <Select
                value={selectedMonth.toString()}
                onValueChange={(val) => setSelectedMonth(Number(val))}
                disabled={realtimeMode}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Month' />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2024, month - 1).toLocaleString('default', {
                        month: 'long'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {timeRange === 'day' && (
              <Select
                value={selectedDay.toString()}
                onValueChange={(val) => setSelectedDay(Number(val))}
                disabled={realtimeMode}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Day' />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={() => setRealtimeMode(!realtimeMode)}
              className={`w-full transition-colors duration-300 sm:w-auto ${
                realtimeMode
                ? 'bg-green-100 text-green-700 shadow hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Real time: {realtimeMode ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            {data.length === 0 ? (
              <div className='flex h-full items-center justify-center'>
                <p className='text-2xl font-bold text-gray-800'>No Data</p>
              </div>
            ) : (
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id='colorCo2' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#16a34a' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#16a34a' stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#e5e7eb'
                />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={formatXAxis}
                  minTickGap={32}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value: number) => `${value}ppm`}
                />
                <Tooltip
                  cursor={{ stroke: '#16a34a', strokeOpacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    borderColor: '#e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`${value} ppm`, 'CO₂ Level']}
                  labelFormatter={formatTooltipLabel}
                />
                <Area
                  type='monotone'
                  dataKey='co2'
                  stroke='#16a34a'
                  fill='url(#colorCo2)'
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: '#22c55e',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
