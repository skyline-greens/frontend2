'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Commands() {
  const [mode, setMode] = useState<'Manual' | 'Automatic'>('Automatic');
  const [light, setLight] = useState<'On' | 'Off'>('On');
  const [airpump, setAirpump] = useState<'On' | 'Off'>('On');
  const [waterpump, setWaterpump] = useState<'On' | 'Off'>('On');
  const [temperature, setTemperature] = useState<number>(23);

  const toggleMode = () => {
    setMode(mode === 'Manual' ? 'Automatic' : 'Manual');
    // Reset controls when switching to Manual
    if (mode === 'Automatic') {
      setLight('Off');
      setAirpump('Off');
      setWaterpump('Off');
      setTemperature(23);
    }
  };

  const toggleLight = () => {
    if (mode === 'Automatic') {
      setLight(light === 'On' ? 'Off' : 'On');
    }
  };

  const toggleAirpump = () => {
    if (mode === 'Automatic') {
      setAirpump(airpump === 'On' ? 'Off' : 'On');
    }
  };

  const toggleWaterpump = () => {
    if (mode === 'Automatic') {
      setWaterpump(waterpump === 'On' ? 'Off' : 'On');
    }
  };

  const adjustTemperature = (delta: number) => {
    if (mode === 'Automatic') {
      setTemperature((prev) => Math.max(10, Math.min(40, prev + delta)));
    }
  };

  return (
    <Card className='@container/card rounded-xl bg-white p-4 shadow-lg'>
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
          {/* Mode Toggle Button */}
          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            <Button
              onClick={toggleMode}
              className={`w-full transition-colors duration-300 sm:w-auto ${
                mode === 'Automatic'
                  ? 'bg-green-100 text-green-700 shadow hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mode: {mode}
            </Button>
          </div>

          {/* Control Buttons - Now in a single row on larger screens */}
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {/* Light Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Light</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  mode !== 'Automatic'
                    ? 'cursor-not-allowed bg-gray-200 opacity-50'
                    : light === 'On'
                      ? 'bg-green-700'
                      : 'bg-gray-200'
                }`}
                onClick={toggleLight}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${light === 'On' ? 'text-white' : 'text-gray-600'}`}
                  >
                    ON
                  </span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${light === 'Off' ? 'text-gray-600' : 'text-white'}`}
                  >
                    OFF
                  </span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    light === 'On' ? 'left-1' : 'left-[calc(100%-2.25rem)]'
                  } ${mode !== 'Automatic' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
            </div>

            {/* Airpump Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>Airpump</span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  mode !== 'Automatic'
                    ? 'cursor-not-allowed bg-gray-200 opacity-50'
                    : airpump === 'On'
                      ? 'bg-green-700'
                      : 'bg-gray-200'
                }`}
                onClick={toggleAirpump}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${airpump === 'On' ? 'text-white' : 'text-gray-600'}`}
                  >
                    ON
                  </span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${airpump === 'Off' ? 'text-gray-600' : 'text-white'}`}
                  >
                    OFF
                  </span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    airpump === 'On' ? 'left-1' : 'left-[calc(100%-2.25rem)]'
                  } ${mode !== 'Automatic' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
            </div>

            {/* Waterpump Toggle Switch */}
            <div className='flex flex-col items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>
                Waterpump
              </span>
              <div
                className={`relative flex h-10 w-24 items-center rounded-full border transition-colors duration-300 ${
                  mode !== 'Automatic'
                    ? 'cursor-not-allowed bg-gray-200 opacity-50'
                    : waterpump === 'On'
                      ? 'bg-green-700'
                      : 'bg-gray-200'
                }`}
                onClick={toggleWaterpump}
              >
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${waterpump === 'On' ? 'text-white' : 'text-gray-600'}`}
                  >
                    ON
                  </span>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                  <span
                    className={`text-xs font-medium ${waterpump === 'Off' ? 'text-gray-600' : 'text-white'}`}
                  >
                    OFF
                  </span>
                </div>
                <div
                  className={`absolute h-8 w-8 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    waterpump === 'On' ? 'left-1' : 'left-[calc(100%-2.25rem)]'
                  } ${mode !== 'Automatic' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>
            </div>

            {/* Temperature Control */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
