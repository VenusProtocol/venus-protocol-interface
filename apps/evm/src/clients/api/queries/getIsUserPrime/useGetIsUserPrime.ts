import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import { type GetIsUserPrimeOutput, getIsUserPrime } from '.';

type UseGetIsUserPrimeInput = {
  accountAddress?: Address;
};

export type UseGetIsUserPrimeQueryKey = [
  FunctionKey.GET_IS_USER_PRIME,
  UseGetIsUserPrimeInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetIsUserPrimeOutput,
  Error,
  GetIsUserPrimeOutput,
  GetIsUserPrimeOutput,
  UseGetIsUserPrimeQueryKey
>;

export const useGetIsUserPrime = (input: UseGetIsUserPrimeInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { address: primeV2ContractAddress } = useGetContractAddress({
    name: 'PrimeV2',
  });
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_IS_USER_PRIME, { ...input, chainId }],

    queryFn: () =>
      callOrThrow(
        {
          primeV2ContractAddress,
          accountAddress: input.accountAddress,
          publicClient,
        },
        params => getIsUserPrime(params),
      ),

    ...options,

    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!input.accountAddress &&
      isPrimeEnabled,
  });
};
