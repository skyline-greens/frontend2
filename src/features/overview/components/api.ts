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

// Define a common return type for your API functions
type ApiResponse<T> = {
  success: boolean;
  error: string | null;
  data: T | null;
};

export const fetchMetrics = async ({
  cellId,
  timeRange,
  selectedYear,
  selectedMonth,
  selectedDay,
  baseUrl = BACKEND_URL,
}: FetchMetricsParams): Promise<ApiResponse<Metric[]>> => {
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
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`) // Added 'as string' for type safety
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
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      return { success: false, error: JSON.stringify(errorData), data: null };
    }
    const data: Metric[] = await response.json();
    const parsedData = data.map(metric => {
      let date = '';
      if (timeRange === 'year') {
        date = `${selectedYear}-${(metric.month?.toString() || '01').padStart(2, '0')}-01`; // Default month to '01'
      } else if (timeRange === 'month') {
        // Ensure selectedMonth is a string for padStart
        const monthStr = typeof selectedMonth === 'number' ? selectedMonth.toString() : selectedMonth || '01';
        date = `${selectedYear}-${monthStr.padStart(2, '0')}-${(metric.day?.toString() || '01').padStart(2, '0')}`; // Default day to '01'
      } else {
        const monthStr = typeof selectedMonth === 'number' ? selectedMonth.toString() : selectedMonth || '01';
        const dayStr = typeof selectedDay === 'number' ? selectedDay.toString() : selectedDay || '01';
        date = `${selectedYear}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}T${(metric.hour?.toString() || '00').padStart(2, '0')}:00:00`; // Default hour to '00'
      }
      return {
        ...metric,
        date,
      };
    });
    return { success: true, error: null, data: parsedData };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return { success: false, error: 'An unknown error occurred', data: null };
  }
};

/**
 * Fetches the current mode (Manual or Automatic) for a specific cell
 */
export const fetchCellMode = async (cellId: string, baseUrl = BACKEND_URL): Promise<ApiResponse<string>> => {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${baseUrl}/cells/${cellId}/mode`, {
      headers: {
        "Authorization": `Bearer ${cookieStore.get("accessToken")?.value}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch mode or parse error JSON' }));
      return {
        success: false,
        error: (errorData && typeof errorData.message === 'string' ? errorData.message : 'Failed to fetch mode'),
        data: null
      };
    }

    const data = await response.json();
    const mode = data.mode === 'manual' ? 'Manual' : 'Automatic';
    return { success: true, error: null, data: mode };
  } catch (error) {
    console.error('Error fetching mode:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return { success: false, error: 'An unknown error occurred while fetching mode', data: null };
  }
};

/**
 * Updates the operating mode (Manual or Automatic) for a specific cell
 */
export const updateCellMode = async (
  cellId: string,
  newMode: 'Manual' | 'Automatic',
  baseUrl = BACKEND_URL
): Promise<ApiResponse<any>> => { // Consider defining a more specific type for responseData if possible
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
      const errorData = await response.json().catch(() => ({ message: 'Failed to update mode or parse error JSON' }));
      return {
        success: false,
        error: (errorData && typeof errorData.message === 'string' ? errorData.message : 'Failed to update mode'),
        data: null
      };
    }

    const responseData = await response.json();
    return { success: true, error: null, data: responseData };
  } catch (error) {
    console.error('Error updating mode:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return { success: false, error: 'An unknown error occurred while updating mode', data: null };
  }
};

/**
 * Sends a command to control actuators for a specific cell
 */
export const sendCellCommand = async (
  cellId: string,
  command: CommandDto,
  baseUrl = BACKEND_URL
): Promise<ApiResponse<any>> => { // Consider defining a more specific type for responseData if possible
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
      const errorData = await response.json().catch(() => ({ message: 'Failed to send command or parse error JSON' }));
      return {
        success: false,
        error: (errorData && typeof errorData.message === 'string' ? errorData.message : 'Failed to send command'),
        data: null
      };
    }

    const responseData = await response.json();
    return { success: true, error: null, data: responseData };
  } catch (error) {
    console.error('Error sending command:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return { success: false, error: 'An unknown error occurred while sending command', data: null };
  }
};
