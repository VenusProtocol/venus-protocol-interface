import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import { type GetPrimeCyclesInput, type GetPrimeCyclesOutput, getPrimeCycles } from '.';

type TrimmedInput = Omit<GetPrimeCyclesInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetPrimeCyclesOutput,
  Error,
  GetPrimeCyclesOutput,
  GetPrimeCyclesOutput,
  [FunctionKey.GET_PRIME_CYCLES, GetPrimeCyclesInput]
>;

export const useGetPrimeCycles = (input: TrimmedInput = {}, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const params = { ...input, chainId };

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_CYCLES, params],
    queryFn: () => getPrimeCycles(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};
