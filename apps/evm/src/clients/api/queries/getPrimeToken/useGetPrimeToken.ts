import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetPrimeTokenOutput, getPrimeToken } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type UseGetPrimeTokenInput = {
  accountAddress?: string;
};

export type UseGetPrimeStatusQueryKey = [
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
  UseGetPrimeStatusQueryKey
>;

const useGetPrimeToken = (input: UseGetPrimeTokenInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_TOKEN, { ...input, chainId }],

    queryFn: () =>
      callOrThrow({ primeContract, accountAddress: input.accountAddress }, params =>
        getPrimeToken(params),
      ),

    ...options,

    enabled:
      (options?.enabled === undefined || options?.enabled) &&
      !!input.accountAddress &&
      isPrimeEnabled,
  });
};

export default useGetPrimeToken;
