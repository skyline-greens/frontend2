import { Dispatch, SetStateAction } from 'react';

// Provided types
export interface Metric {
  cellId: string;
  temperature?: number;
  humidity?: number;
  co2?: number;
  lightIntensity?: number;
  moisture?: number;
  air?: boolean;
  water?: boolean;
  light?: boolean;
  hour?: number;
  day?: number;
  month?: number;
  year?: number;
  date?: string;
}

type Scope = 'day' | 'month' | 'year';

interface QueryMetricsDto {
  scope?: Scope;
  metrics?: string;
  startDay?: string;
  endDay?: string;
  day?: string;
  month?: string;
  year?: string;
}

interface FetchMetricsParams {
  cellId: string;
  timeRange: Scope;
  selectedYear: number | string;
  selectedMonth?: number | string;
  selectedDay?: number | string;
  setData: Dispatch<SetStateAction<any[]>>;
  baseUrl?: string; // Optional, defaults to localhost
}

export const fetchMetrics = async ({
  cellId,
  timeRange,
  selectedYear,
  selectedMonth,
  selectedDay,
  setData,
  baseUrl = 'http://localhost:8000',
}: FetchMetricsParams) => {
  try {
    const queryParams: QueryMetricsDto = {
      scope: timeRange,
      metrics: 'temperature,humidity,co2',
      year: `${selectedYear}`,
    };

    if (timeRange === 'month' || timeRange === 'day') {
      queryParams['month'] = `${selectedMonth}`;
    }

    if (timeRange === 'day') {
      queryParams['day'] = `${selectedDay}`;
    }

    // Build query string from defined parameters
    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${baseUrl}/cells/${cellId}/metrics${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      const b = await response.json();
      throw new Error(JSON.stringify(b));
    }

    const data: Metric[] = await response.json();
    const parsedData = data.map(metric => {
      let date = '';
      if (timeRange === 'year') {
        date = `${selectedYear}-${(metric.month?.toString() || '00').padStart(2, '0')}-01`;
      } else if (timeRange === 'month') {
        date = `${selectedYear}-${selectedMonth?.toString().padStart(2, '0')}-${(metric.day || 0).toString().padStart(2, '0')}`;
      } else {
        date = `${selectedYear}-${selectedMonth?.toString().padStart(2, '0')}-${selectedDay?.toString().padStart(2, '0')}T${(metric.hour || 0).toString().padStart(2, '0')}:00:00`;
      }
      return {
        ...metric,
        date,
      };
    });

    setData(parsedData);
  } catch (error) {
    console.error('Error fetching metrics:', error);
  }
};
