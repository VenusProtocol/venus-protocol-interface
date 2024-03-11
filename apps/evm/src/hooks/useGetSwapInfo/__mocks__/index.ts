import type { UseGetSwapInfoOutput } from '../types';

const useGetSwapInfo = vi.fn(
  (): UseGetSwapInfoOutput => ({
    swap: undefined,
    error: undefined,
    isLoading: false,
  }),
);

export default useGetSwapInfo;
