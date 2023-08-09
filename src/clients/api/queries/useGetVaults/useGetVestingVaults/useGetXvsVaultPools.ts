import { UseQueryOptions, UseQueryResult, useQueries } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  getXvsVaultPendingWithdrawalsFromBeforeUpgrade,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
} from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

export interface UseGetXvsVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  | GetXvsVaultPoolInfoOutput
  | GetXvsVaultUserInfoOutput
  | GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput
>[];

const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount,
}: UseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  const poolQueries: UseQueryOptions<
    | GetXvsVaultPoolInfoOutput
    | GetXvsVaultUserInfoOutput
    | GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput
  >[] = [];

  // Fetch pool infos
  // TODO: use multicall
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract }, params =>
          getXvsVaultPoolInfo({
            ...params,
            rewardTokenAddress: TOKENS.xvs.address,
            poolIndex,
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        { rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
    });

    poolQueries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract }, params =>
          getXvsVaultUserInfo({
            ...params,
            rewardTokenAddress: TOKENS.xvs.address,
            poolIndex,
            accountAddress: accountAddress || '',
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
      ],
      enabled: !!accountAddress,
    });

    poolQueries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract }, params =>
          getXvsVaultPendingWithdrawalsFromBeforeUpgrade({
            ...params,
            rewardTokenAddress: TOKENS.xvs.address,
            poolIndex,
            accountAddress: accountAddress || '',
          }),
        ),
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
