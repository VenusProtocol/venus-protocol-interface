import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { XVS_TOKEN_ADDRESS } from './constants';
import getXvsVaultPoolInfos, { GetXvsVaultPoolInfosOutput } from '../getXvsVaultPoolInfos';
import getXvsVaultPendingReward, {
  GetXvsVaultPendingRewardWeiOutput,
} from '../getXvsVaultPendingRewardWei';
import getXvsVaultUserInfo, { IGetXvsVaultUserInfoOutput } from '../getXvsVaultUserInfo';

export interface IUseGetXvsVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  GetXvsVaultPoolInfosOutput | GetXvsVaultPendingRewardWeiOutput | IGetXvsVaultUserInfoOutput
>[];

const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount,
}: IUseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const xvsVaultContract = useXvsVaultProxyContract();

  const poolQueries: UseQueryOptions<
    GetXvsVaultPoolInfosOutput | GetXvsVaultPendingRewardWeiOutput | IGetXvsVaultUserInfoOutput
  >[] = [];

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getXvsVaultPoolInfos({
          xvsVaultContract,
          tokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, XVS_TOKEN_ADDRESS, poolIndex],
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultPendingReward({
          xvsVaultContract,
          tokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_PENDING_REWARD, XVS_TOKEN_ADDRESS, poolIndex],
      enabled: !!accountAddress,
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultUserInfo({
          xvsVaultContract,
          tokenAddress: XVS_TOKEN_ADDRESS,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_USER_INFO, XVS_TOKEN_ADDRESS, poolIndex],
      enabled: !!accountAddress,
    });
  }

  return useQueries(poolQueries);
};

export default useGetXvsVaultPools;
