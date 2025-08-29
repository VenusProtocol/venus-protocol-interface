import { debounce } from '@venusprotocol/ui';
import { useEffect, useMemo, useState } from 'react';

export default function useDebounceValue<T>(value: T, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetter = useMemo(
    () =>
      debounce({
        fn: setDebouncedValue,
        delay,
      }),
    [delay],
  );

  useEffect(() => {
    debouncedSetter(value);
  }, [value, debouncedSetter]);

  return debouncedValue;
}
