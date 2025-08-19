export const DEFAULT_DEBOUNCE_DELAY = 300;

export function debounce<T extends (...args: any[]) => any>({
  fn,
  delay = DEFAULT_DEBOUNCE_DELAY,
}: {
  fn: T;
  delay?: number;
}): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | number | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // Clear the previous timeout if it exists
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
