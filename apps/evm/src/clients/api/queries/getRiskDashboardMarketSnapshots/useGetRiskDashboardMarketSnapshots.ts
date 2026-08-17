import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardMarketSnapshotsResponse,
  type RiskDashboardMarketSnapshotKind,
  getRiskDashboardMarketSnapshots,
} from '.';

export type UseGetRiskDashboardMarketSnapshotsQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_MARKET_SNAPSHOTS,
  { chainId: ChainId; kind: RiskDashboardMarketSnapshotKind },
];

type Options = QueryObserverOptions<
  GetRiskDashboardMarketSnapshotsResponse,
  Error,
  GetRiskDashboardMarketSnapshotsResponse,
  GetRiskDashboardMarketSnapshotsResponse,
  UseGetRiskDashboardMarketSnapshotsQueryKey
>;

export const useGetRiskDashboardMarketSnapshots = (
  { kind }: { kind: RiskDashboardMarketSnapshotKind },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_MARKET_SNAPSHOTS, { chainId, kind }],
    queryFn: () => getRiskDashboardMarketSnapshots({ chainId, kind }),
    ...options,
  });
};
