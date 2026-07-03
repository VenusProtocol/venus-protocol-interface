import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import { type GetPrimeEffectiveStakeOutput, getPrimeEffectiveStake } from '.';

interface UseGetPrimeEffectiveStakeInput {
  accountAddress?: Address;
}

export type UseGetPrimeEffectiveStakeQueryKey = [
  FunctionKey.GET_PRIME_EFFECTIVE_STAKE,
  UseGetPrimeEffectiveStakeInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetPrimeEffectiveStakeOutput,
  Error,
  GetPrimeEffectiveStakeOutput,
  GetPrimeEffectiveStakeOutput,
  UseGetPrimeEffectiveStakeQueryKey
>;

export const useGetPrimeEffectiveStake = (
  { accountAddress }: UseGetPrimeEffectiveStakeInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: primeLeaderboardContractAddress } = useGetContractAddress({
    name: 'PrimeLeaderboard',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_EFFECTIVE_STAKE, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ accountAddress, primeLeaderboardContractAddress }, params =>
        getPrimeEffectiveStake({ publicClient, ...params }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!accountAddress,
  });
};
