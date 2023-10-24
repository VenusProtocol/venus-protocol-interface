import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetPrimeClaimWaitingPeriodOutput, getPrimeStatus } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

type Options = QueryObserverOptions<
  GetPrimeClaimWaitingPeriodOutput,
  Error,
  GetPrimeClaimWaitingPeriodOutput,
  GetPrimeClaimWaitingPeriodOutput,
  FunctionKey.GET_PRIME_STATUS
>;

const useGetPrimeClaimWaitingPeriod = (options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    FunctionKey.GET_PRIME_STATUS,
    () => callOrThrow({ primeContract }, params => getPrimeStatus(params)),
    {
      ...options,
      enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
    },
  );
};

export default useGetPrimeClaimWaitingPeriod;
