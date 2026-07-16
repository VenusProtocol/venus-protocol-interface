import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardStablecoinRatesResponse, getRiskDashboardStablecoinRates } from '.';

export type UseGetRiskDashboardStablecoinRatesQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_STABLECOIN_RATES,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardStablecoinRatesResponse,
  Error,
  GetRiskDashboardStablecoinRatesResponse,
  GetRiskDashboardStablecoinRatesResponse,
  UseGetRiskDashboardStablecoinRatesQueryKey
>;

export const useGetRiskDashboardStablecoinRates = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_STABLECOIN_RATES, { chainId }],
    queryFn: () => getRiskDashboardStablecoinRates({ chainId }),
    ...options,
  });
};
