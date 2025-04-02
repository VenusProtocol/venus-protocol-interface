import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import { type GetPrimeStatusOutput, getPrimeStatus } from '.';

interface UseGetPrimeStatusInput {
  accountAddress?: Address;
}

export type UseGetPrimeStatusQueryKey = [
  FunctionKey.GET_PRIME_STATUS,
  UseGetPrimeStatusInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPrimeStatusOutput,
  Error,
  GetPrimeStatusOutput,
  GetPrimeStatusOutput,
  UseGetPrimeStatusQueryKey
>;

export const useGetPrimeStatus = (
  { accountAddress }: UseGetPrimeStatusInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContractAddress = useGetPrimeContractAddress();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_STATUS, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ primeContractAddress: primeContractAddress as Address }, params =>
        getPrimeStatus({ accountAddress, publicClient, ...params }),
      ),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
  });
};
