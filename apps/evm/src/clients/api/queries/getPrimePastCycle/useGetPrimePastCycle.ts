import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import { type GetPrimePastCycleInput, type GetPrimePastCycleOutput, getPrimePastCycle } from '.';

type TrimmedInput = Omit<GetPrimePastCycleInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetPrimePastCycleOutput,
  Error,
  GetPrimePastCycleOutput,
  GetPrimePastCycleOutput,
  [FunctionKey.GET_PRIME_PAST_CYCLE, GetPrimePastCycleInput]
>;

export const useGetPrimePastCycle = ({ cycleIndex }: TrimmedInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const params = { cycleIndex, chainId };

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_PAST_CYCLE, params],
    queryFn: () => getPrimePastCycle(params),
    ...options,
  });
};
