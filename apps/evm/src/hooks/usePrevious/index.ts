import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T) => {
  const previousValueRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
};
