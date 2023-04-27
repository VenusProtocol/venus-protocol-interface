import useGetSwapInfo from 'hooks/useGetSwapInfo';

export const getLastUseGetSwapInfoCallArgs = () =>
  (useGetSwapInfo as jest.Mock).mock.calls[(useGetSwapInfo as jest.Mock).mock.calls.length - 1];
