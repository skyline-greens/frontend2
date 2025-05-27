'use client';

import { TimeRangeSelector } from '@/features/overview/TimeRangeSelector';
import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { fetchMetrics, Metric } from './api';
import { Button } from '@/components/ui/button';
import { socket } from '@/socket';
import { appendWithMaxLength } from '@/helpers/general';

export const description = 'An interactive line chart';

const chartConfig = {
  temperature: {
    label: 'Temperature',
    color: '#15803d'
  },
  humidity: {
    label: 'Humidity',
    color: '#15803d'
  }
} satisfies ChartConfig;

interface CellMetric {
  temperature?: number;
  humidity?: number;
  lightIntensity?: number;
  moisture?: number;
  co2?: number;
  airPump?: number;
  waterPump?: number;
  light?: number;
}

export function LineGraph({ cellId }: { cellId: string }) {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('temperature');
  const [data, setData] = useState<Metric[]>([]);
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!realtimeMode) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          const result = await fetchMetrics({
            cellId: cellId,
            timeRange: timeRange,
            selectedYear: selectedYear,
            selectedMonth: selectedMonth,
            selectedDay: selectedDay,
          });
          
          if (result.success && result.data) {
            setData(result.data);
          } else {
            console.error('Failed to fetch metrics:', result.error);
            setData([]);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          setData([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    } else {
      const metricHandler = (metric: CellMetric) => {
        setData((old) => appendWithMaxLength(old, {
          ...metric,
          air: metric.airPump === 1, 
          water: metric.waterPump === 1,
          light: metric.light === 1,
          cellId,
          date: new Date().toISOString(),
        }));
      };

      socket.on("metrics", metricHandler);
      return () => {
        socket.off("metrics", metricHandler);
        setData([]);
      };
    }
  }, [cellId, timeRange, selectedYear, selectedMonth, selectedDay, realtimeMode]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => 2023 + i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const total = React.useMemo(
    () => ({
      Temperature: data?.reduce((acc, curr) => acc + (curr?.temperature || 0), 0) || 0,
      Humidity: data?.reduce((acc, curr) => acc + (curr?.humidity || 0), 0) || 0
    }),
    [data]
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card rounded-xl shadow-lg'>
      <CardHeader className='flex flex-col items-start justify-between border-b border-gray-100 p-6 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle className='text-2xl font-bold text-gray-800'>
            Temperature & Humidity Trends
          </CardTitle>
          <CardDescription className='text-gray-500'>
            Analyze environmental data over time
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
              className={`w-full mr-2 transition-colors duration-300 sm:w-auto ${
                realtimeMode
                  ? 'bg-green-100 text-green-700 shadow hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Real time: {realtimeMode ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
        <div className='mb-6 flex gap-4'>
          {['temperature', 'humidity'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className={`flex-1 rounded-lg p-4 text-left transition-all duration-200 ${
                  activeChart === chart
                    ? 'border border-green-200 bg-green-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-sm text-gray-500 capitalize'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-2xl font-bold text-gray-800'>
                  {total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
        <ChartContainer config={chartConfig} className='h-[300px] w-full'>
          {isLoading ? (
            <div className='flex h-full items-center justify-center'>
              <p className='text-2xl font-bold text-gray-800'>Loading...</p>
            </div>
          ) : data.length === 0 ? (
            <div className='flex h-full items-center justify-center'>
              <p className='text-2xl font-bold text-gray-800'>No Data</p>
            </div>
          ) : (
            <LineChart
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12
              }}
            >
              <defs>
                <linearGradient id='fillLine' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#15803d' stopOpacity={0.8} />
                  <stop offset='100%' stopColor='#15803d' stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke='#e5e7eb'
                strokeDasharray='3 3'
              />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => {
                  if (realtimeMode) {
                    const date = new Date(value);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const seconds = date.getSeconds().toString().padStart(2, '0');
                    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
                    const microseconds = '000'; // Simulated, as Date lacks microsecond precision
                    return `${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
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
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#d1d5db' }}
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) =>
                  activeChart === 'temperature' ? `${value}°C` : `${value}%`
                }
              />
              <ChartTooltip
                cursor={{ stroke: '#15803d', strokeOpacity: 0.1 }}
                content={
                  <ChartTooltipContent
                    className='w-[180px] rounded-lg border border-gray-200 bg-white p-3 shadow-md'
                    nameKey='views'
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      if (timeRange === 'day') {
                        return date.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
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
                    }}
                    formatter={(value) =>
                      activeChart === 'temperature' ? `${value}°C` : `${value}%`
                    }
                  />
                }
              />
              <Line
                type='monotone'
                dataKey={activeChart}
                stroke='#15803d'
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#15803d',
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
