import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';

import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import { type GetLiteTotalsInput, type GetLiteTotalsOutput, getLiteTotals } from '..';

export type UseGetLiteTotalsQueryKey = [FunctionKey.GET_LITE_TOTALS, GetLiteTotalsInput];

type Options = QueryObserverOptions<
  GetLiteTotalsOutput,
  Error,
  GetLiteTotalsOutput,
  GetLiteTotalsOutput,
  UseGetLiteTotalsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetLiteTotals = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_LITE_TOTALS, { chainId }],
    queryFn: () => getLiteTotals({ chainId }),
    refetchInterval,
    ...options,
  });
};
