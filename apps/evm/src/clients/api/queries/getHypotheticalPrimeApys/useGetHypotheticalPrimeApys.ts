import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetHypotheticalPrimeApysInput,
  GetHypotheticalPrimeApysOutput,
  getHypotheticalPrimeApys,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
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
