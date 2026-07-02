import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import { type GetPrimeCycleInput, type GetPrimeCycleOutput, getPrimeCycle } from '.';

type TrimmedInput = Omit<GetPrimeCycleInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetPrimeCycleOutput,
  Error,
  GetPrimeCycleOutput,
  GetPrimeCycleOutput,
  [FunctionKey.GET_PRIME_CYCLE, GetPrimeCycleInput]
>;

export const useGetPrimeCycle = ({ cycleIndex }: TrimmedInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const params = { cycleIndex, chainId };

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_CYCLE, params],
    queryFn: () => getPrimeCycle(params),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
  });
};
