import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetLiquidityHubInput, type GetLiquidityHubOutput, getLiquidityHub } from '..';

export type UseGetLiquidityHubQueryKey = [FunctionKey.GET_LIQUIDITY_HUB, GetLiquidityHubInput];

type Options = QueryObserverOptions<
  GetLiquidityHubOutput,
  Error,
  GetLiquidityHubOutput,
  GetLiquidityHubOutput,
  UseGetLiquidityHubQueryKey
>;

export const useGetLiquidityHub = (input: GetLiquidityHubInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUB, input],
    queryFn: () => getLiquidityHub(input),
    ...options,
  });
