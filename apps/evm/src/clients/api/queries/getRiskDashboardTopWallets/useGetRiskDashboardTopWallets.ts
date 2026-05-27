import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardTopWalletsResponse,
  type RiskDashboardTopWalletsKind,
  getRiskDashboardTopWallets,
} from '.';

export interface UseGetRiskDashboardTopWalletsInput {
  kind: RiskDashboardTopWalletsKind;
  limit?: number;
}

export type UseGetRiskDashboardTopWalletsQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_TOP_WALLETS,
  { chainId: ChainId; kind: RiskDashboardTopWalletsKind; limit?: number },
];

type Options = QueryObserverOptions<
  GetRiskDashboardTopWalletsResponse,
  Error,
  GetRiskDashboardTopWalletsResponse,
  GetRiskDashboardTopWalletsResponse,
  UseGetRiskDashboardTopWalletsQueryKey
>;

export const useGetRiskDashboardTopWallets = (
  { kind, limit }: UseGetRiskDashboardTopWalletsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_TOP_WALLETS, { chainId, kind, limit }],
    queryFn: () => getRiskDashboardTopWallets({ chainId, kind, limit }),
    ...options,
  });
};
