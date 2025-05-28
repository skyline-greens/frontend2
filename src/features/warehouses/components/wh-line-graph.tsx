'use client';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
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

// Generate fake temperature data for 3 cells
const generateFakeData = (
  timeRange: 'day' | 'month' | 'year',
  selectedYear: number,
  selectedMonth: number,
  selectedDay: number
) => {
  const data: { date: string; cell1Temp: number; cell2Temp: number; cell3Temp: number }[] = [];
  const startDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  
  let numPoints: number;
  let timeIncrement: (date: Date, i: number) => Date;

  if (timeRange === 'year') {
    numPoints = 12; // One point per month
    timeIncrement = (date: Date, i: number) => new Date(date.getFullYear(), i, 1);
  } else if (timeRange === 'month') {
    numPoints = 30; // One point per day
    timeIncrement = (date: Date, i: number) => new Date(date.getFullYear(), date.getMonth(), i + 1);
  } else {
    numPoints = 24; // One point per hour
    timeIncrement = (date: Date, i: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), i);
  }

  for (let i = 0; i < numPoints; i++) {
    const currentDate = timeRange === 'year'
      ? timeIncrement(startDate, i)
      : timeRange === 'month'
      ? timeIncrement(startDate, i)
      : timeIncrement(startDate, i);

    // Generate random temperatures for each cell
    const cell1Temp = Math.round(15 + Math.random() * 15);
    const cell2Temp = Math.round(15 + Math.random() * 15);
    const cell3Temp = Math.round(15 + Math.random() * 15);

    data.push({
      date: currentDate.toISOString(),
      cell1Temp,
      cell2Temp,
      cell3Temp,
    });
  }

  return data;
};

export default function TemperatureLineChart({ warehouseId }: { warehouseId: string }) {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [data, setData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Generate fake data based on the selected time range and filters
    const fakeData = generateFakeData(timeRange, selectedYear, selectedMonth, selectedDay);
    setData(fakeData);
  }, [timeRange, selectedYear, selectedMonth, selectedDay]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => 2023 + i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    if (timeRange === 'day') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
    } else {
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

  if (!isClient) {
    return null;
  }

  return (
    <Card className='h-full @container/card rounded-xl shadow-lg'>
      <CardHeader className='flex flex-col items-start justify-between border-b border-gray-100 p-6 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-2'>
          <CardTitle className='text-2xl font-bold text-gray-800'>
            Temperature Monitoring
          </CardTitle>
          <CardDescription className='text-gray-500'>
            Temperature (°C) across all cells in Warehouse {warehouseId}
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
          <div className='grid grid-cols-3 gap-2 sm:flex sm:gap-2'>
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

        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            {data.length === 0 ? (
              <div className='flex h-full items-center justify-center'>
                <p className='text-2xl font-bold text-gray-800'>No Data</p>
              </div>
            ) : (
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
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
                  tickFormatter={(value: number) => `${value}°C`}
                />
                <Tooltip
                  cursor={{ stroke: '#16a34a', strokeOpacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    borderColor: '#e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}°C`,
                    name.replace('Temp', '')
                  ]}
                  labelFormatter={formatTooltipLabel}
                />
                <Legend formatter={(value) => value.replace('Temp', '')} />
                <Line
                  type='monotone'
                  dataKey='cell1Temp'
                  name='Cell 1'
                  stroke='#16a34a'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: '#22c55e',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='cell2Temp'
                  name='Cell 2'
                  stroke='#d946ef'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: '#e879f9',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='cell3Temp'
                  name='Cell 3'
                  stroke='#2563eb'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: '#3b82f6',
                    strokeWidth: 2,
                    fill: '#fff'
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}