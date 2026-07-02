import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import { type GetIsUserPrimeV2Output, getIsUserPrimeV2 } from '..';

type UseGetIsUserPrimeV2Input = {
  accountAddress?: Address;
};

export type UseGetIsUserPrimeV2QueryKey = [
  FunctionKey.GET_IS_USER_PRIME_V2,
  UseGetIsUserPrimeV2Input & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetIsUserPrimeV2Output,
  Error,
  GetIsUserPrimeV2Output,
  GetIsUserPrimeV2Output,
  UseGetIsUserPrimeV2QueryKey
>;

export const useGetIsUserPrimeV2 = (
  input: UseGetIsUserPrimeV2Input,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const { address: primeV2ContractAddress } = useGetContractAddress({
    name: 'PrimeV2',
  });
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_IS_USER_PRIME_V2, { ...input, chainId }],
    queryFn: () =>
      callOrThrow(
        {
          accountAddress: input.accountAddress,
          primeV2ContractAddress,
          publicClient,
        },
        params => getIsUserPrimeV2(params),
      ),
    ...options,
    enabled:
      (options?.enabled === undefined || options.enabled) &&
      !!input.accountAddress &&
      isPrimeEnabled &&
      isPrimeLeaderboardEnabled,
  });
};
