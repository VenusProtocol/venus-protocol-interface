import { UseGetSwapInfoOutput } from '../types';

const useGetSwapInfo = jest.fn(
  (): UseGetSwapInfoOutput => ({
    swap: undefined,
    error: undefined,
    isLoading: false,
  }),
);

export default useGetSwapInfo;
