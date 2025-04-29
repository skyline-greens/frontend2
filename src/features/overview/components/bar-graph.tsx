'use client';

import { TimeRangeSelector } from '@/features/overview/TimeRangeSelector';
import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useMemo, useState } from 'react';
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

export function LineGraph() {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('temperature');

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    if (timeRange === 'year') {
      for (let month = 1; month <= 12; month++) {
        const temperature = Math.floor(Math.random() * 40) + 10;
        const humidity = Math.floor(Math.random() * 70) + 30;
        data.push({
          date: `${selectedYear}-${month.toString().padStart(2, '0')}-01`,
          temperature,
          humidity
        });
      }
    } else if (timeRange === 'month') {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const temperature = Math.floor(Math.random() * 40) + 10;
        const humidity = Math.floor(Math.random() * 70) + 30;
        data.push({
          date: `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          temperature,
          humidity
        });
      }
    } else {
      for (let hour = 0; hour < 24; hour++) {
        const temperature = Math.floor(Math.random() * 15) + 20;
        const humidity = Math.floor(Math.random() * 30) + 50;
        data.push({
          date: `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00`,
          temperature,
          humidity
        });
      }
    }
    return data;
  }, [timeRange, selectedYear, selectedMonth, selectedDay]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const total = React.useMemo(
    () => ({
      Temperature: chartData.reduce((acc, curr) => acc + curr.temperature, 0),
      Humidity: chartData.reduce((acc, curr) => acc + curr.humidity, 0)
    }),
    [chartData]
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card rounded-xl bg-white shadow-lg'>
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
          />
          <div className='grid grid-cols-2 gap-2 sm:flex sm:gap-2'>
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(Number(val))}
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
          <LineChart
            data={chartData}
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
