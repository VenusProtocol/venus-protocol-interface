import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import {
  type GetHypotheticalPrimeApysInput,
  type GetHypotheticalPrimeApysOutput,
  getHypotheticalPrimeApys,
} from '.';

interface UseGetPrimeTokenInput
  extends Omit<
    GetHypotheticalPrimeApysInput,
    'primeContractAddress' | 'accountAddress' | 'publicClient'
  > {
  accountAddress?: Address;
}

export type UseGetHypotheticalPrimeApysQueryKey = [
  FunctionKey.GET_HYPOTHETICAL_PRIME_APYS,
  UseGetPrimeTokenInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetHypotheticalPrimeApysOutput,
  Error,
  GetHypotheticalPrimeApysOutput,
  GetHypotheticalPrimeApysOutput,
  UseGetHypotheticalPrimeApysQueryKey
>;

export const useGetHypotheticalPrimeApys = (
  input: UseGetPrimeTokenInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_HYPOTHETICAL_PRIME_APYS, { ...input, chainId }],

    queryFn: () =>
      callOrThrow({ primeContractAddress, accountAddress: input.accountAddress }, params =>
        getHypotheticalPrimeApys({
          publicClient,
          ...params,
          ...input,
        }),
      ),

    ...options,

    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!input.accountAddress &&
      isPrimeEnabled,
  });
};
