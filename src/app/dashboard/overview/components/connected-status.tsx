"use client";
import React, { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { Button } from '@/components/ui/button';

export function ConnectedStatus({ cellId }: { cellId: string }): React.ReactElement {
  const [status, setStatus] = useState<'disconnected' | 'connected' | 'subscribed'>("disconnected");

  useEffect(() => {
    const onConnect = () => {
      setStatus("connected");
      socket.emit("subscribeToMetrics", { cellId }, () => {
        setStatus("subscribed");
      });
    }

    socket.emit("subscribeToMetrics", { cellId }, () => {
      setStatus("subscribed");
    });

    const onDisconnect = () => {
      setStatus("disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    }
  }, [cellId]);

  const classMap = {
    subscribed: 'bg-green-100 text-green-700 shadow hover:bg-green-200',
    connected: 'bg-orange-100 text-orange-700 shadow hover:bg-orange-200',
    disconnected: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formattedConnected = formatStatus(status);
  const statusClasses = classMap[status] || classMap.disconnected;

  return (
    <Button
      disabled
      className={`w-full transition-colors duration-300 sm:w-auto ${statusClasses}`}
      aria-label={`Connection status: ${formattedConnected}`}
    >
      {formattedConnected}
    </Button>
  );
}
