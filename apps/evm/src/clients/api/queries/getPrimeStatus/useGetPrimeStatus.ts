import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import { type GetPrimeStatusOutput, getPrimeStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

interface UseGetPrimeStatusInput {
  accountAddress?: string;
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

const useGetPrimeStatus = (
  { accountAddress }: UseGetPrimeStatusInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_STATUS, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ primeContract }, params => getPrimeStatus({ accountAddress, ...params })),
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
  });
};

export default useGetPrimeStatus;
