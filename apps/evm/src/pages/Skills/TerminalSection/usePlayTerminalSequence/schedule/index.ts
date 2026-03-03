export const schedule = (ms: number, timeoutIds: number[]) =>
  new Promise<void>(resolve => {
    const timeoutId = window.setTimeout(resolve, ms);
    timeoutIds.push(timeoutId);
  });
