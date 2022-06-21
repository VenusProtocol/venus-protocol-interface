import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { Vault, TokenId } from 'types';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { convertWeiToTokens, getContractAddress } from 'utilities';
import {
  useGetBalanceOf,
  useGetVenusVaiVaultDailyRateWei,
  useGetMarkets,
  useGetVaiVaultUserInfo,
  useGetVaiVaultPendingXvsWei,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const { data: totalVaiStakedWei, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf({
    accountAddress: VAI_VAULT_ADDRESS,
    tokenId: TOKENS.vai.id as TokenId,
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
    () => (getMarketsData?.markets || []).find(market => market.id === TOKENS.xvs.id)?.tokenPrice,
    [JSON.stringify(getMarketsData?.markets)],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedWei || !vaiVaultDailyRateWei || !xvsPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: vaiVaultDailyRateWei,
      tokenId: TOKENS.xvs.id as TokenId,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalVaiStakedWei,
          tokenId: TOKENS.vai.id as TokenId,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardTokenId: TOKENS.xvs.id as TokenId,
      stakedTokenId: TOKENS.vai.id as TokenId,
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
