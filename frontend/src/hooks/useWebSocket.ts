import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [url]);

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
};
