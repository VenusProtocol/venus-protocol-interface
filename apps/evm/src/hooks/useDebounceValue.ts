import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_DEBOUNCE_DELAY, debounce } from 'utilities';

export default function useDebounceValue<T>(value: T, delay = DEFAULT_DEBOUNCE_DELAY) {
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
