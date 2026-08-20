import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardWalletsInput,
  type GetRiskDashboardWalletsResponse,
  getRiskDashboardWallets,
} from '.';

export type UseGetRiskDashboardWalletsInput = Omit<GetRiskDashboardWalletsInput, 'chainId'>;

export type UseGetRiskDashboardWalletsQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_WALLETS,
  UseGetRiskDashboardWalletsInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardWalletsResponse,
  Error,
  GetRiskDashboardWalletsResponse,
  GetRiskDashboardWalletsResponse,
  UseGetRiskDashboardWalletsQueryKey
>;

export const useGetRiskDashboardWallets = (
  input: UseGetRiskDashboardWalletsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_WALLETS, { chainId, ...input }],
    queryFn: () => getRiskDashboardWallets({ chainId, ...input }),
    ...options,
  });
};
