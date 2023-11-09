import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { GetPrimeTokenOutput, getPrimeToken } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

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

const useGetPrimeToken = (input: UseGetPrimeTokenInput, options?: Options) => {
  const { chainId } = useAuth();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_PRIME_TOKEN, { ...input, chainId }],
    () =>
      callOrThrow({ primeContract, accountAddress: input.accountAddress }, params =>
        getPrimeToken(params),
      ),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) &&
        !!input.accountAddress &&
        isPrimeEnabled,
    },
  );
};

export default useGetPrimeToken;
