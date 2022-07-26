import { useMemo } from 'react';
import { TokenId, Vault } from 'types';
import { getContractAddress } from 'utilities';

import {
  useGetBalanceOf,
  useGetVrtVaultAccruedInterestWei,
  useGetVrtVaultInterestRatePerBlock,
  useGetVrtVaultUserInfo,
} from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';

export interface UseGetVrtVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const vrtVaultProxyAddress = getContractAddress('vrtVaultProxy');

const useGetVrtVault = ({ accountAddress }: { accountAddress?: string }): UseGetVrtVaultOutput => {
  const {
    data: vrtVaultInterestRatePerBlock,
    isLoading: isGetVrtVaultInterestRatePerBlockLoading,
  } = useGetVrtVaultInterestRatePerBlock();

  const { data: totalVrtStakedData, isLoading: isGetTotalVrtStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: vrtVaultProxyAddress,
      tokenId: TOKENS.vrt.id as TokenId,
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const { data: vrtVaultUserInfo, isLoading: isGetVrtVaultUserInfoLoading } =
    useGetVrtVaultUserInfo(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userPendingVrtRewardWei, isLoading: isUserPendingVrtRewardWeiLoading } =
    useGetVrtVaultAccruedInterestWei(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const data: Vault | undefined = useMemo(() => {
    if (!vrtVaultInterestRatePerBlock || !totalVrtStakedData) {
      return undefined;
    }

    const vrtVaultDailyInterestRate = vrtVaultInterestRatePerBlock
      .multipliedBy(BLOCKS_PER_DAY)
      .dividedBy(1e18); // Percentages are expressed with 18 decimals in smart contracts

    const dailyEmissionWei = vrtVaultDailyInterestRate.multipliedBy(totalVrtStakedData.balanceWei);
    const stakingAprPercentage = vrtVaultDailyInterestRate
      .multipliedBy(100)
      .multipliedBy(DAYS_PER_YEAR)
      .toNumber();

    return {
      rewardTokenId: TOKENS.vrt.id as TokenId,
      stakedTokenId: TOKENS.vrt.id as TokenId,
      dailyEmissionWei,
      totalStakedWei: totalVrtStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: vrtVaultUserInfo?.stakedVrtWei,
      userPendingRewardWei: userPendingVrtRewardWei,
    };
  }, [
    vrtVaultInterestRatePerBlock?.toFixed(),
    totalVrtStakedData?.balanceWei.toFixed(),
    JSON.stringify(vrtVaultUserInfo),
    userPendingVrtRewardWei?.toFixed(),
  ]);

  const isLoading =
    isGetVrtVaultInterestRatePerBlockLoading ||
    isGetTotalVrtStakedWeiLoading ||
    isGetVrtVaultUserInfoLoading ||
    isUserPendingVrtRewardWeiLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVrtVault;
