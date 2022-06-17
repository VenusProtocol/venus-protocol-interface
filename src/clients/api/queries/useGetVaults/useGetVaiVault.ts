import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { Vault } from 'types';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { convertWeiToCoins } from 'utilities/common';
import {
  useGetBalanceOf,
  useGetVenusVaiVaultDailyRateWei,
  useGetMarkets,
  useGetVaiVaultUserInfo,
  useGetVaiVaultPendingXvsWei,
} from 'clients/api';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { VAI_TOKEN_ID, VAI_VAULT_ADDRESS } from './constants';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const { data: totalVaiStakedWei, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf({
    accountAddress: VAI_VAULT_ADDRESS,
    tokenId: VAI_TOKEN_ID,
  });

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userPendingVaiRewardWei, isLoading: isGetUserPendingVaiRewardWeiLoading } =
    useGetVaiVaultPendingXvsWei(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: vaiVaultDailyRateWei, isLoading: isGetVaiVaultDailyRateWeiLoading } =
    useGetVenusVaiVaultDailyRateWei();

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets();
  const xvsPriceDollars: BigNumber | undefined = useMemo(
    () => (getMarketsData?.markets || []).find(market => market.id === XVS_TOKEN_ID)?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedWei || !vaiVaultDailyRateWei || !xvsPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToCoins({
      valueWei: vaiVaultDailyRateWei,
      tokenId: XVS_TOKEN_ID,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToCoins({
          valueWei: totalVaiStakedWei,
          tokenId: VAI_TOKEN_ID,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardTokenId: XVS_TOKEN_ID,
      stakedTokenId: VAI_TOKEN_ID,
      dailyEmissionWei: vaiVaultDailyRateWei,
      totalStakedWei: totalVaiStakedWei,
      stakingAprPercentage,
      userStakedWei: vaiVaultUserInfo?.stakedVaiWei,
      userPendingRewardWei: userPendingVaiRewardWei,
    };
  }, [
    totalVaiStakedWei?.toFixed(),
    vaiVaultDailyRateWei?.toFixed(),
    xvsPriceDollars?.toFixed(),
    JSON.stringify(vaiVaultUserInfo),
    userPendingVaiRewardWei?.toFixed(),
  ]);

  const isLoading =
    isGetTotalVaiStakedWeiLoading ||
    isGetVaiVaultDailyRateWeiLoading ||
    isGetMarketsLoading ||
    isGetVaiVaultUserInfoLoading ||
    isGetUserPendingVaiRewardWeiLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaiVault;
