export const extractSettledPromiseValue = <T>(settledPromise: PromiseSettledResult<T>) =>
  settledPromise.status === 'fulfilled' ? settledPromise.value : undefined;
