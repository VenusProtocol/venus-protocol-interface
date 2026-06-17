import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import { type GetPrimeOnChainPendingRewardsOutput, getPrimeOnChainPendingRewards } from '.';

interface UseGetPrimeOnChainPendingRewardsInput {
  accountAddress?: Address;
}

export type UseGetPrimeOnChainPendingRewardsQueryKey = [
  FunctionKey.GET_PRIME_ONCHAIN_PENDING_REWARDS,
  UseGetPrimeOnChainPendingRewardsInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetPrimeOnChainPendingRewardsOutput,
  Error,
  GetPrimeOnChainPendingRewardsOutput,
  GetPrimeOnChainPendingRewardsOutput,
  UseGetPrimeOnChainPendingRewardsQueryKey
>;

export const useGetPrimeOnChainPendingRewards = (
  { accountAddress }: UseGetPrimeOnChainPendingRewardsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const { address: primeV2ContractAddress } = useGetContractAddress({ name: 'PrimeV2' });

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_ONCHAIN_PENDING_REWARDS, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ accountAddress, primeV2ContractAddress }, params =>
        getPrimeOnChainPendingRewards({ publicClient, ...params }),
      ),
    ...options,
    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      isPrimeLeaderboardEnabled &&
      !!accountAddress,
  });
};
