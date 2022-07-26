import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { TokenId, Vault } from 'types';
import { convertWeiToTokens, getContractAddress } from 'utilities';

import {
  useGetBalanceOf,
  useGetMarkets,
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
      tokenId: TOKENS.vai.id as TokenId,
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

  const { data: getMarketsData, isLoading: isGetMarketsLoading } = useGetMarkets();
  const xvsPriceDollars: BigNumber | undefined = useMemo(
    () => (getMarketsData?.markets || []).find(market => market.id === TOKENS.xvs.id)?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedData || !vaiVaultDailyRateWei || !xvsPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: vaiVaultDailyRateData.dailyRateWei,
      tokenId: TOKENS.xvs.id as TokenId,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalVaiStakedData.balanceWei,
          tokenId: TOKENS.vai.id as TokenId,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardTokenId: TOKENS.xvs.id as TokenId,
      stakedTokenId: TOKENS.vai.id as TokenId,
      dailyEmissionWei: vaiVaultDailyRateWei,
      totalStakedWei: totalVaiStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: vaiVaultUserInfo?.stakedVaiWei,
      userPendingRewardWei: userPendingVaiRewardData?.pendingXvsWei,
    };
  }, [
    totalVaiStakedData?.balanceWei.toFixed(),
    vaiVaultDailyRateWei?.toFixed(),
    xvsPriceDollars?.toFixed(),
    JSON.stringify(vaiVaultUserInfo),
    userPendingVaiRewardData?.pendingXvsWei.toFixed(),
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
