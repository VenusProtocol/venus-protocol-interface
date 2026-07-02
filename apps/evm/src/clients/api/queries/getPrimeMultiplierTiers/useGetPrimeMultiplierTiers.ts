import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { type GetPrimeMultiplierTiersOutput, getPrimeMultiplierTiers } from '.';

export type UseGetPrimeMultiplierTiersQueryKey = [
  FunctionKey.GET_PRIME_MULTIPLIER_TIERS,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetPrimeMultiplierTiersOutput,
  Error,
  GetPrimeMultiplierTiersOutput,
  GetPrimeMultiplierTiersOutput,
  UseGetPrimeMultiplierTiersQueryKey
>;

export const useGetPrimeMultiplierTiers = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const { address: primeLeaderboardContractAddress } = useGetContractAddress({
    name: 'PrimeLeaderboard',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_MULTIPLIER_TIERS, { chainId }],
    queryFn: () =>
      callOrThrow({ primeLeaderboardContractAddress }, params =>
        getPrimeMultiplierTiers({ publicClient, ...params }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isPrimeLeaderboardEnabled,
  });
};
