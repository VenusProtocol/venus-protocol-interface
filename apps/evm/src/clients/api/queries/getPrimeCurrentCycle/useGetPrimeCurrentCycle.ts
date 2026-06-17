import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import {
  type GetPrimeCurrentCycleInput,
  type GetPrimeCurrentCycleOutput,
  getPrimeCurrentCycle,
} from '.';

type Options = QueryObserverOptions<
  GetPrimeCurrentCycleOutput,
  Error,
  GetPrimeCurrentCycleOutput,
  GetPrimeCurrentCycleOutput,
  [FunctionKey.GET_PRIME_CURRENT_CYCLE, GetPrimeCurrentCycleInput]
>;

export const useGetPrimeCurrentCycle = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_CURRENT_CYCLE, { chainId }],
    queryFn: () => getPrimeCurrentCycle({ chainId }),
    ...options,
  });
};
