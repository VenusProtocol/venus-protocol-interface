import { useGetPrimeContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import {
  GetHypotheticalPrimeApysInput,
  GetHypotheticalPrimeApysOutput,
  getHypotheticalPrimeApys,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

interface UseGetPrimeTokenInput
  extends Omit<GetHypotheticalPrimeApysInput, 'primeContract' | 'accountAddress'> {
  accountAddress?: string;
}

export type UseGetHypotheticalPrimeApysQueryKey = [
  FunctionKey.GET_HYPOTHETICAL_PRIME_APYS,
  UseGetPrimeTokenInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetHypotheticalPrimeApysOutput,
  Error,
  GetHypotheticalPrimeApysOutput,
  GetHypotheticalPrimeApysOutput,
  UseGetHypotheticalPrimeApysQueryKey
>;

const useGetHypotheticalPrimeApys = (input: UseGetPrimeTokenInput, options?: Options) => {
  const { chainId } = useAuth();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_HYPOTHETICAL_PRIME_APYS, { ...input, chainId }],
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
