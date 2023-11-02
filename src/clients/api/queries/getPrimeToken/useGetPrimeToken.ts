import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetPrimeTokenOutput, getPrimeToken } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

type UseGetPrimeTokenInput = {
  accountAddress?: string;
};

type Options = QueryObserverOptions<
  GetPrimeTokenOutput,
  Error,
  GetPrimeTokenOutput,
  GetPrimeTokenOutput,
  [FunctionKey.GET_PRIME_TOKEN, UseGetPrimeTokenInput]
>;

const useGetPrimeToken = (input: UseGetPrimeTokenInput, options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_PRIME_TOKEN, input],
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
