import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import {
  type GetPrimeMinimumStakeInput,
  type GetPrimeMinimumStakeOutput,
  getPrimeMinimumStake,
} from '.';

type Options = QueryObserverOptions<
  GetPrimeMinimumStakeOutput,
  Error,
  GetPrimeMinimumStakeOutput,
  GetPrimeMinimumStakeOutput,
  [FunctionKey.GET_PRIME_MINIMUM_STAKE, GetPrimeMinimumStakeInput]
>;

export const useGetPrimeMinimumStake = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_MINIMUM_STAKE, { chainId }],
    queryFn: () => getPrimeMinimumStake({ chainId }),
    ...options,
  });
};
