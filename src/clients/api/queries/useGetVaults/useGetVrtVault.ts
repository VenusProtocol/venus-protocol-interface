import { useMemo } from 'react';

import { Vault, TokenId } from 'types';
import {
  useGetVrtVaultInterestRatePerBlock,
  useGetBalanceOf,
  useGetVrtVaultUserInfo,
  useGetVrtVaultAccruedInterestWei,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { TOKENS } from 'constants/tokens';
import { getContractAddress } from 'utilities';

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

  const { data: totalVrtStakedWei, isLoading: isGetTotalVrtStakedWeiLoading } = useGetBalanceOf({
    accountAddress: vrtVaultProxyAddress,
    tokenId: TOKENS.vrt.id as TokenId,
  });

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
    if (!vrtVaultInterestRatePerBlock || !totalVrtStakedWei) {
      return undefined;
    }

    const vrtVaultDailyInterestRate = vrtVaultInterestRatePerBlock
      .multipliedBy(BLOCKS_PER_DAY)
      .dividedBy(1e18); // Percentages are expressed with 18 decimals in smart contracts

    const dailyEmissionWei = vrtVaultDailyInterestRate.multipliedBy(totalVrtStakedWei);
    const stakingAprPercentage = vrtVaultDailyInterestRate
      .multipliedBy(100)
      .multipliedBy(DAYS_PER_YEAR)
      .toNumber();

    return {
      rewardTokenId: TOKENS.vrt.id as TokenId,
      stakedTokenId: TOKENS.vrt.id as TokenId,
      dailyEmissionWei,
      totalStakedWei: totalVrtStakedWei,
      stakingAprPercentage,
      userStakedWei: vrtVaultUserInfo?.stakedVrtWei,
      userPendingRewardWei: userPendingVrtRewardWei,
    };
  }, [
    vrtVaultInterestRatePerBlock?.toFixed(),
    totalVrtStakedWei?.toFixed(),
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
