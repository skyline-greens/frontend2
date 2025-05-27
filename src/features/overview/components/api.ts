"use server";
import { CommandDto } from '@/dto/command.dto';
import { BACKEND_URL } from '@/constants/api';
import { cookies } from 'next/headers';

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
  baseUrl?: string; // Optional, defaults to localhost
}

export const fetchMetrics = async ({
  cellId,
  timeRange,
  selectedYear,
  selectedMonth,
  selectedDay,
  baseUrl = BACKEND_URL,
}: FetchMetricsParams) => {
  console.log(cellId)
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
    console.log(baseUrl);
    const url = `${baseUrl}/cells/${cellId}/metrics${queryString ? `?${queryString}` : ''}`;
    const cookieStore = await cookies();
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${cookieStore.get("accessToken")?.value}`
      }
    });
    if (!response.ok) {
      const b = await response.json();
      return { success: false, error: JSON.stringify(b), data: null };
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
    return { success: true, error: null, data: parsedData };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Fetches the current mode (Manual or Automatic) for a specific cell
 */
export const fetchCellMode = async (cellId: string, baseUrl = BACKEND_URL) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${baseUrl}/cells/${cellId}/mode`, {
      headers: {
        "Authorization": `Bearer ${cookieStore.get("accessToken")?.value}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch mode' }));
      return { 
        success: false, 
        error: errorData.message || 'Failed to fetch mode', 
        data: null 
      };
    }

    const data = await response.json();
    const mode = data.mode === 'manual' ? 'Manual' : 'Automatic';
    return { success: true, error: null, data: mode };
  } catch (error) {
    console.error('Error fetching mode:', error);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Updates the operating mode (Manual or Automatic) for a specific cell
 */
export const updateCellMode = async (
  cellId: string, 
  newMode: 'Manual' | 'Automatic',
  baseUrl = BACKEND_URL
) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${baseUrl}/cells/${cellId}/mode`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${cookieStore.get("accessToken")?.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: newMode === 'Manual' ? 'manual' : 'auto'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update mode' }));
      return { 
        success: false, 
        error: errorData.message || 'Failed to update mode', 
        data: null 
      };
    }

    const responseData = await response.json();
    return { success: true, error: null, data: responseData };
  } catch (error) {
    console.error('Error updating mode:', error);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Sends a command to control actuators for a specific cell
 */
export const sendCellCommand = async (
  cellId: string, 
  command: CommandDto,
  baseUrl = BACKEND_URL
) => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${baseUrl}/cells/${cellId}/command`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${cookieStore.get("accessToken")?.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send command' }));
      return { 
        success: false, 
        error: errorData.message || 'Failed to send command', 
        data: null 
      };
    }

    const responseData = await response.json();
    return { success: true, error: null, data: responseData };
  } catch (error) {
    console.error('Error sending command:', error);
    return { success: false, error: error.message, data: null };
  }
};
