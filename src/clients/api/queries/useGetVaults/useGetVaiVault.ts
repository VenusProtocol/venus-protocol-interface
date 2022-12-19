import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Vault } from 'types';
import { convertWeiToTokens, getContractAddress } from 'utilities';

import {
  useGetBalanceOf,
  useGetMainAssets,
  useGetVaiVaultPendingXvs,
  useGetVaiVaultUserInfo,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const { data: totalVaiStakedData, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: VAI_VAULT_ADDRESS,
      token: TOKENS.vai,
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userPendingVaiRewardData, isLoading: isGetUserPendingVaiRewardWeiLoading } =
    useGetVaiVaultPendingXvs(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: vaiVaultDailyRateData, isLoading: isGetVaiVaultDailyRateWeiLoading } =
    useGetVenusVaiVaultDailyRate();

  const {
    data: { assets },
    isLoading: isGetMainMarketsLoading,
  } = useGetMainAssets({
    accountAddress,
  });
  const xvsPriceDollars: BigNumber | undefined = useMemo(
    () =>
      (assets || []).find(
        asset =>
          asset.vToken.underlyingToken.address.toLowerCase() === TOKENS.xvs.address.toLowerCase(),
      )?.tokenPriceDollars,
    [assets],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedData || !vaiVaultDailyRateData || !xvsPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: vaiVaultDailyRateData.dailyRateWei,
      token: TOKENS.xvs,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalVaiStakedData.balanceWei,
          token: TOKENS.vai,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardToken: TOKENS.xvs,
      stakedToken: TOKENS.vai,
      dailyEmissionWei: vaiVaultDailyRateData.dailyRateWei,
      totalStakedWei: totalVaiStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: vaiVaultUserInfo?.stakedVaiWei,
      userPendingRewardWei: userPendingVaiRewardData?.pendingXvsWei,
    };
  }, [
    totalVaiStakedData?.balanceWei.toFixed(),
    vaiVaultDailyRateData?.dailyRateWei.toFixed(),
    xvsPriceDollars?.toFixed(),
    JSON.stringify(vaiVaultUserInfo),
    userPendingVaiRewardData?.pendingXvsWei.toFixed(),
  ]);

  const isLoading =
    isGetTotalVaiStakedWeiLoading ||
    isGetVaiVaultDailyRateWeiLoading ||
    isGetMainMarketsLoading ||
    isGetVaiVaultUserInfoLoading ||
    isGetUserPendingVaiRewardWeiLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaiVault;
