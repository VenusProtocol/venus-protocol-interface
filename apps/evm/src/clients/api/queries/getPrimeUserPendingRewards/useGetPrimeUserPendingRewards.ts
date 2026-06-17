import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import {
  type GetPrimeUserPendingRewardsInput,
  type GetPrimeUserPendingRewardsOutput,
  getPrimeUserPendingRewards,
} from '.';

interface UseGetPrimeUserPendingRewardsInput {
  accountAddress?: Address;
}

type Options = QueryObserverOptions<
  GetPrimeUserPendingRewardsOutput,
  Error,
  GetPrimeUserPendingRewardsOutput,
  GetPrimeUserPendingRewardsOutput,
  [FunctionKey.GET_PRIME_USER_PENDING_REWARDS, GetPrimeUserPendingRewardsInput]
>;

export const useGetPrimeUserPendingRewards = (
  { accountAddress }: UseGetPrimeUserPendingRewardsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_PRIME_USER_PENDING_REWARDS,
      { chainId, accountAddress: accountAddress as Address },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params => getPrimeUserPendingRewards({ chainId, ...params })),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!accountAddress,
  });
};
