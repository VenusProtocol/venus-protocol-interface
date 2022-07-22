import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';

import {
  GetXvsVaultPendingRewardWeiOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  getXvsVaultPendingRewardWei,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';

export interface UseGetXvsVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  GetXvsVaultPoolInfoOutput | GetXvsVaultPendingRewardWeiOutput | GetXvsVaultUserInfoOutput
>[];

const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount,
}: UseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const xvsVaultContract = useXvsVaultProxyContract();

  const poolQueries: UseQueryOptions<
    GetXvsVaultPoolInfoOutput | GetXvsVaultPendingRewardWeiOutput | GetXvsVaultUserInfoOutput
  >[] = [];

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getXvsVaultPoolInfo({
          xvsVaultContract,
          rewardTokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        { rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
      ],
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultPendingRewardWei({
          xvsVaultContract,
          rewardTokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_PENDING_REWARD_WEI,
        { accountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
      ],
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultUserInfo({
          xvsVaultContract,
          rewardTokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
      ],
      enabled: !!accountAddress,
    });
  }

  return useQueries(poolQueries);
};

export default useGetXvsVaultPools;
