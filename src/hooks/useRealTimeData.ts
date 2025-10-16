import { useEffect, useRef } from 'react';

export const useRealTimeData = (
  fetchFunction: () => Promise<void>,
  intervalMs: number = 30000 // 30 seconds
) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for real-time updates
    intervalRef.current = setInterval(() => {
      fetchFunction();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchFunction, intervalMs]);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
};