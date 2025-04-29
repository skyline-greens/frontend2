'use client';

import { IconTrendingUp } from '@tabler/icons-react';
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
import { useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

export default function CO2AreaChart() {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const co2Data = useMemo(() => {
    const data = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    if (timeRange === 'year') {
      for (let month = 1; month <= 12; month++) {
        const baseCO2 = 400;
        const seasonalVariation = Math.sin(((month - 1) * Math.PI) / 6) * 20;
        const randomVariation = Math.random() * 10;
        const co2 = Math.round(baseCO2 + seasonalVariation + randomVariation);

        data.push({
          date: `${selectedYear}-${month.toString().padStart(2, '0')}-01`,
          co2
        });
      }
    } else if (timeRange === 'month') {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const baseCO2 = 410;
        const dayVariation = (day / daysInMonth) * 10;
        const randomVariation = Math.random() * 5;
        const co2 = Math.round(baseCO2 + dayVariation + randomVariation);

        data.push({
          date: `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          co2
        });
      }
    } else {
      for (let hour = 0; hour < 24; hour++) {
        const baseCO2 = 420;
        const hourVariation = Math.sin(((hour - 6) * Math.PI) / 12) * 15;
        const randomVariation = Math.random() * 3;
        const co2 = Math.round(baseCO2 + hourVariation + randomVariation);

        data.push({
          date: `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00`,
          co2
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

  const formatXAxis = (value: string) => {
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
  };

  return (
    <Card className='h-full p-4'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col space-y-2'>
          <CardTitle className='mt-5 text-2xl leading-none font-bold tracking-tight text-gray-800'>
            CO₂ Levels Monitoring
          </CardTitle>
          <CardDescription className='text-sm'>
            Atmospheric carbon dioxide concentration (ppm) over time
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between'>
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

        <div className='h-[250px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={co2Data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                axisLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={formatXAxis}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value: number) => `${value}ppm`}
              />
              <Tooltip
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
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
