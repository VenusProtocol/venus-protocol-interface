import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import {
  type GetPrimeUserCycleRewardsInput,
  type GetPrimeUserCycleRewardsOutput,
  getPrimeUserCycleRewards,
} from '.';

interface UseGetPrimeUserCycleRewardsInput {
  cycleIndex: number;
  accountAddress?: Address;
}

type Options = QueryObserverOptions<
  GetPrimeUserCycleRewardsOutput,
  Error,
  GetPrimeUserCycleRewardsOutput,
  GetPrimeUserCycleRewardsOutput,
  [FunctionKey.GET_PRIME_USER_CYCLE_REWARDS, GetPrimeUserCycleRewardsInput]
>;

export const useGetPrimeUserCycleRewards = (
  { cycleIndex, accountAddress }: UseGetPrimeUserCycleRewardsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_PRIME_USER_CYCLE_REWARDS,
      { chainId, cycleIndex, accountAddress: accountAddress as Address },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params =>
        getPrimeUserCycleRewards({ chainId, cycleIndex, ...params }),
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!accountAddress,
  });
};
