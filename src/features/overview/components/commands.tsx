'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { socket } from '@/socket';
import { CellMetric } from '@/dto/cell-metric.dto';
import { CommandDto } from '@/dto/command.dto';
import { fetchCellMode, updateCellMode, sendCellCommand } from './api';

interface ActuatorStates {
  light: 'On' | 'Off';
  airPump: 'On' | 'Off';
  waterPump: 'On' | 'Off';
  heater: 'On' | 'Off';
}

interface CommandsProps {
  cellId: string;
}

export default function Commands({ cellId }: CommandsProps) {
  const [mode, setMode] = useState<'Manual' | 'Automatic'>('Automatic');
  const [states, setStates] = useState<ActuatorStates>({
    light: 'Off',
    airPump: 'Off',
    waterPump: 'Off',
    heater: 'Off',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const metricHandler = useMemo(() => (data: CellMetric) => {
    setStates({
      light: data.light === 1 ? 'On' : 'Off',
      airPump: data.airPump === 1 ? 'On' : 'Off',
      waterPump: data.waterPump === 1 ? 'On' : 'Off',
      heater: data.heater === 1 ? 'On' : 'Off',
    });
  }, []);

  useEffect(() => {
    const getMode = async () => {
      try {
        setIsLoading(true);
        const newMode = await fetchCellMode(cellId);
        setMode(newMode);
        
        if (newMode === "Automatic") {
          socket.on("metrics", metricHandler);
          return () => {
            socket.off("metrics", metricHandler);
          }
        }
      } catch (error) {
        console.error('Error fetching mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getMode();
    return () => {
      socket.off("metrics", metricHandler);
    };
  }, [cellId, metricHandler]);

  const toggleMode = async () => {
    const newMode = mode === 'Manual' ? 'Automatic' : 'Manual';

    try {
      setIsLoading(true);
      await updateCellMode(cellId, newMode);
      
      // Only update local state if the request succeeded
      setMode(newMode);
      if (newMode === "Manual") {
        socket.off("metrics", metricHandler);
      } else {
        socket.on("metrics", metricHandler);
      }
    } catch (error) {
      // Optionally add error handling UI feedback here
    } finally {
      setIsLoading(false);
    }
  };

  const sendCommand = async (commandType: string, value: boolean) => {
    if (mode !== 'Manual') return;

    try {
      setActionInProgress(commandType);
      
      const payload: CommandDto = {
        light: commandType === 'light' ? value : states.light === 'On',
        airPump: commandType === 'airPump' ? value : states.airPump === 'On',
        waterPump: commandType === 'waterPump' ? value : states.waterPump === 'On',
        heater: commandType === 'heater' ? value : states.heater === 'On'
      };
      
      const response = await sendCellCommand(cellId, payload);

      // Update local state only after successful API call
      const newValue = value ? 'On' : 'Off';
      setStates(prevStates => ({
        ...prevStates,
        [commandType]: newValue
      }));

    } catch (error) {
      // Revert the UI state in case of failure
    } finally {
      setActionInProgress(null);
    }
  };

  const toggleLight = async () => {
    if (mode === 'Manual') {
      const newValue = states.light === 'On' ? false : true;
      await sendCommand('light', newValue);
    }
  };

  const toggleAirpump = async () => {
    if (mode === 'Manual') {
      const newValue = states.airPump === 'On' ? false : true;
      await sendCommand('airPump', newValue);
    }
  };

  const toggleWaterpump = async () => {
    if (mode === 'Manual') {
      const newValue = states.waterPump === 'On' ? false : true;
      await sendCommand('waterPump', newValue);
    }
  };

  const toggleHeater = async () => {
    if (mode === 'Manual') {
      const newValue = states.heater === 'On' ? false : true;
      await sendCommand('heater', newValue);
    }
  };

  const getToggleBackground = (state: 'On' | 'Off', isManual: boolean) => {
    if (!isManual) {
      return state === 'On' ? 'bg-green-200' : 'bg-gray-200';
    }
    return state === 'On' ? 'bg-green-500' : 'bg-gray-300';
  };

  return (
    <Card className='@container/card rounded-xl  p-4 shadow-lg'>
      <CardHeader>
        <CardTitle className='pt-2 text-2xl font-bold text-gray-800'>
          Commands
        </CardTitle>
        <CardDescription className='text-gray-500'>
          Control your farm from your home.
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            <Button
              onClick={toggleMode}
              disabled={isLoading}
              aria-busy={isLoading}
              className={`w-full transition-colors duration-300 sm:w-auto ${
                isLoading ? 'bg-gray-100 text-gray-400' :
                mode === 'Manual'
                  ? 'bg-green-500 text-white shadow hover:bg-green-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isLoading ? 'Loading...' : `Mode: ${mode}`}
            </Button>
          </div>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {/* Light Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Light</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  getToggleBackground(states.light, mode === 'Manual')
                } ${
                  mode === 'Manual'
                    ? actionInProgress === 'light' ? 'cursor-wait' : 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
                onClick={toggleLight}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>ON</span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>OFF</span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    states.light === 'On' ? 'left-[calc(100%-2.25rem)]' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* Airpump Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Air Pump</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  getToggleBackground(states.airPump, mode === 'Manual')
                } ${
                  mode === 'Manual'
                    ? actionInProgress === 'airPump' ? 'cursor-wait' : 'cursor-pointer'
                    : 'cursor-not-allowed'  
                }`}
                onClick={toggleAirpump}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>ON</span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>OFF</span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    states.airPump === 'On' ? 'left-[calc(100%-2.25rem)]' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* Waterpump Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Water Pump</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  getToggleBackground(states.waterPump, mode === 'Manual')
                } ${
                  mode === 'Manual'
                    ? actionInProgress === 'waterPump' ? 'cursor-wait' : 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
                onClick={toggleWaterpump}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>ON</span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>OFF</span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    states.waterPump === 'On' ? 'left-[calc(100%-2.25rem)]' : 'left-1'
                  }`}
                />
              </div>
            </div>

            {/* Temperature Control */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Temperature</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  getToggleBackground(states.heater, mode === 'Manual')
                } ${
                  mode === 'Manual'
                    ? actionInProgress === 'heater' ? 'cursor-wait' : 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
                onClick={toggleHeater}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>ON</span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span className={`text-xs font-medium text-white`}>OFF</span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    states.heater === 'On' ? 'left-[calc(100%-2.25rem)]' : 'left-1'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
