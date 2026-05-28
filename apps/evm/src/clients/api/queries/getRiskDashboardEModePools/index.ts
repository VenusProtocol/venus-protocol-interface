import type { ChainId } from 'types';
import type { Address } from 'viem';
import { fetchRiskDashboard } from '../fetchRiskDashboard';

export interface ApiRiskDashboardEModeSetting {
  poolId: string;
  label: string;
  isActive: boolean;
  marketAddress: Address;
  collateralFactorMantissa: string;
  liquidationThresholdMantissa: string;
  liquidationIncentiveMantissa: string;
  canBeCollateral: boolean;
  isBorrowable: boolean;
}

export interface GetRiskDashboardEModePoolsResponse {
  chainId: string;
  settings: ApiRiskDashboardEModeSetting[];
}

export const getRiskDashboardEModePools = ({ chainId }: { chainId: ChainId }) =>
  fetchRiskDashboard<GetRiskDashboardEModePoolsResponse>({
    endpoint: '/risk-dashboard/emode-pools',
    chainId,
  });
