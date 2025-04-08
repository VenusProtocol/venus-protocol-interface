import { type UseQueryOptions, type UseQueryResult, useQueries } from '@tanstack/react-query';

import {
  type GetXvsVaultPendingWithdrawalsBalanceOutput,
  type GetXvsVaultPoolInfoOutput,
  type GetXvsVaultUserInfoOutput,
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  getXvsVaultPendingWithdrawalsBalance,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
  getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract, useGetXvsVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';

export interface UseGetXvsVaultPoolsInput {
  poolsCount: number;
  accountAddress?: string;
}

export type UseGetXvsVaultPoolsOutput = UseQueryResult<
  | GetXvsVaultPoolInfoOutput
  | GetXvsVaultUserInfoOutput
  | GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput
  | GetXvsVaultPendingWithdrawalsBalanceOutput
>[];

export const useGetXvsVaultPools = ({
  accountAddress,
  poolsCount,
}: UseGetXvsVaultPoolsInput): UseGetXvsVaultPoolsOutput => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  const xvsVaultContract = useGetXvsVaultContract();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const queries: UseQueryOptions<
    | GetXvsVaultPoolInfoOutput
    | GetXvsVaultUserInfoOutput
    | GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput
    | GetXvsVaultPendingWithdrawalsBalanceOutput
  >[] = [];

  // Fetch pool infos
  // TODO: use multicall
  for (let poolIndex = 0; poolIndex < poolsCount; poolIndex++) {
    queries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContractAddress, xvs }, params =>
          getXvsVaultPoolInfo({
            ...params,
            publicClient,
            rewardTokenAddress: params.xvs.address,
            poolIndex,
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        { chainId, rewardTokenAddress: xvs?.address, poolIndex },
      ],
    });

    queries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract, xvs }, params =>
          getXvsVaultPendingWithdrawalsBalance({
            ...params,
            rewardTokenAddress: params.xvs.address,
            poolIndex,
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_BALANCE,
        { chainId, accountAddress, rewardTokenAddress: xvs?.address, poolIndex },
      ],
    });

    queries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract, xvs }, params =>
          getXvsVaultUserInfo({
            ...params,
            rewardTokenAddress: params.xvs.address,
            poolIndex,
            accountAddress: accountAddress || '',
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        { chainId, accountAddress, rewardTokenAddress: xvs?.address, poolIndex },
      ],
      enabled: !!accountAddress,
    });

    queries.push({
      queryFn: () =>
        callOrThrow({ xvsVaultContract, xvs }, params =>
          getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade({
            ...params,
            rewardTokenAddress: params.xvs.address,
            poolIndex,
            accountAddress: accountAddress || '',
          }),
        ),
      queryKey: [
        FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
        { chainId, accountAddress, rewardTokenAddress: xvs?.address, poolIndex },
      ],
      enabled: !!accountAddress,
    });
  }

  return useQueries({ queries });
};
