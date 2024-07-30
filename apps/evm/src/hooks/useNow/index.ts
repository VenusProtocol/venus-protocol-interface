import { useEffect, useState } from 'react';

export interface UseNowInput {
  intervalMs?: number;
}

export const useNow = (input?: UseNowInput) => {
  const [now, setNow] = useState(new Date());
  const intervalMs = input?.intervalMs || 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
};
