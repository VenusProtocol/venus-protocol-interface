import { UseGetSwapInfoOutput } from '../types';

const useGetSwapInfo = jest.fn(
  (): UseGetSwapInfoOutput => ({
    swap: undefined,
    error: undefined,
  }),
);

export default useGetSwapInfo;
