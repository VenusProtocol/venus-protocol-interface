import { QueryObserverOptions, useQuery } from 'react-query';

import { GetPrimeStatusOutput, getPrimeStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
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

const useGetPrimeStatus = ({ accountAddress }: UseGetPrimeStatusInput, options?: Options) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_PRIME_STATUS, { accountAddress, chainId }],
    () => callOrThrow({ accountAddress, primeContract }, params => getPrimeStatus(params)),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) && !!accountAddress && isPrimeEnabled,
    },
  );
};

export default useGetPrimeStatus;
