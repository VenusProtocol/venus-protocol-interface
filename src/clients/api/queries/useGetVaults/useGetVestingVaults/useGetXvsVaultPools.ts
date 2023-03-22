import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';

import {
  GetXvsVaultPendingRewardOutput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  getXvsVaultPendingReward,
  getXvsVaultPendingWithdrawalsFromBeforeUpgrade,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

export interface UseGetXvsVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  | GetXvsVaultPoolInfoOutput
  | GetXvsVaultUserInfoOutput
  | GetXvsVaultPendingRewardOutput
  | GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput
>[];

const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount,
}: UseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const xvsVaultContract = useXvsVaultProxyContract();

  const poolQueries: UseQueryOptions<
    | GetXvsVaultPoolInfoOutput
    | GetXvsVaultUserInfoOutput
    | GetXvsVaultPendingRewardOutput
    | GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput
  >[] = [];

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getXvsVaultPoolInfo({
          xvsVaultContract,
          rewardTokenAddress: TOKENS.xvs.address,
          poolIndex,
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        { rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultPendingReward({
          xvsVaultContract,
          rewardTokenAddress: TOKENS.xvs.address,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_PENDING_REWARD,
        { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultUserInfo({
          xvsVaultContract,
          rewardTokenAddress: TOKENS.xvs.address,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
      enabled: !!accountAddress,
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultPendingWithdrawalsFromBeforeUpgrade({
          xvsVaultContract,
          rewardTokenAddress: TOKENS.xvs.address,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
        { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
      enabled: !!accountAddress,
    });
  }

  return useQueries(poolQueries);
};

export default useGetXvsVaultPools;
