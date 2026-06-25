import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import {
  type GetPrimeCurrentCycleInput,
  type GetPrimeCurrentCycleOutput,
  getPrimeCurrentCycle,
} from '.';

const ENDED_REFETCH_INTERVAL_MS = 5_000;
const ACTIVE_REFETCH_CAP_MS = 60 * 60 * 1000;

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
    refetchInterval: query => {
      const endsAt = query.state.data?.cycle?.endsAt;
      const msUntilEnd = endsAt ? endsAt.getTime() - Date.now() : 0;

      return msUntilEnd > 0
        ? Math.min(msUntilEnd + 1_000, ACTIVE_REFETCH_CAP_MS)
        : ENDED_REFETCH_INTERVAL_MS;
    },
    ...options,
  });
};
