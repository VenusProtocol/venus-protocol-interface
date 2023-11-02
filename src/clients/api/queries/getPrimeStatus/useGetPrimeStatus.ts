import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetPrimeStatusOutput, getPrimeStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

interface UseGetPrimeStatusInput {
  accountAddress?: string;
}

type Options = QueryObserverOptions<
  GetPrimeStatusOutput,
  Error,
  GetPrimeStatusOutput,
  GetPrimeStatusOutput,
  [FunctionKey.GET_PRIME_STATUS, UseGetPrimeStatusInput]
>;

const useGetPrimeStatus = ({ accountAddress }: UseGetPrimeStatusInput, options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_PRIME_STATUS, { accountAddress }],
    () => callOrThrow({ accountAddress, primeContract }, params => getPrimeStatus(params)),
    {
      ...options,
      enabled:
        (options?.enabled === undefined || options?.enabled) && !!accountAddress && isPrimeEnabled,
    },
  );
};

export default useGetPrimeStatus;
