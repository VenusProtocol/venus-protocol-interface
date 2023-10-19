import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetIsAddressPrimeOutput, getIsAddressPrime } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

type UseGetIsAddressPrimeInput = {
  accountAddress?: string;
};

type Options = QueryObserverOptions<
  GetIsAddressPrimeOutput,
  Error,
  GetIsAddressPrimeOutput,
  GetIsAddressPrimeOutput,
  [FunctionKey.GET_IS_ACCOUNT_PRIME, UseGetIsAddressPrimeInput]
>;

const useGetIsAddressPrime = (input: UseGetIsAddressPrimeInput, options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_IS_ACCOUNT_PRIME, input],
    () =>
      callOrThrow({ primeContract, accountAddress: input.accountAddress }, params =>
        getIsAddressPrime(params),
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

export default useGetIsAddressPrime;
