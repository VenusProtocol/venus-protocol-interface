import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  GetHypotheticalPrimeApysInput,
  GetHypotheticalPrimeApysOutput,
  getHypotheticalPrimeApys,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

interface UseGetPrimeTokenInput
  extends Omit<GetHypotheticalPrimeApysInput, 'primeContract' | 'accountAddress'> {
  accountAddress?: string;
}

type Options = QueryObserverOptions<
  GetHypotheticalPrimeApysOutput,
  Error,
  GetHypotheticalPrimeApysOutput,
  GetHypotheticalPrimeApysOutput,
  [FunctionKey.GET_HYPOTHETICAL_PRIME_APYS, UseGetPrimeTokenInput]
>;

const useGetHypotheticalPrimeApys = (input: UseGetPrimeTokenInput, options?: Options) => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_HYPOTHETICAL_PRIME_APYS, input],
    () =>
      callOrThrow({ primeContract, accountAddress: input.accountAddress }, params =>
        getHypotheticalPrimeApys({
          ...params,
          ...input,
        }),
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

export default useGetHypotheticalPrimeApys;
