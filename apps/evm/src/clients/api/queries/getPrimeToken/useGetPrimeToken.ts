import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import { type GetPrimeTokenOutput, getPrimeToken } from '.';

type UseGetPrimeTokenInput = {
  accountAddress?: Address;
};

export type UseGetPrimeTokenQueryKey = [
  FunctionKey.GET_PRIME_TOKEN,
  UseGetPrimeTokenInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPrimeTokenOutput,
  Error,
  GetPrimeTokenOutput,
  GetPrimeTokenOutput,
  UseGetPrimeTokenQueryKey
>;

export const useGetPrimeToken = (input: UseGetPrimeTokenInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_TOKEN, { ...input, chainId }],

    queryFn: () =>
      callOrThrow(
        {
          primeContractAddress: primeContractAddress,
          accountAddress: input.accountAddress,
          publicClient,
        },
        params => getPrimeToken(params),
      ),

    ...options,

    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!input.accountAddress &&
      isPrimeEnabled,
  });
};
