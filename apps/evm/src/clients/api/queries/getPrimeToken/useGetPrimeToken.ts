import { QueryObserverOptions, useQuery } from 'react-query';

import { GetPrimeTokenOutput, getPrimeToken } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
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

const useGetPrimeToken = (input: UseGetPrimeTokenInput, options?: Options) => {
  const { chainId } = useChainId();
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
