import { useEffect, useState } from 'react';

export const DEFAULT_DEBOUNCE_DELAY = 300;

export default function useDebounceValue<T>(value: T, delay = DEFAULT_DEBOUNCE_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
