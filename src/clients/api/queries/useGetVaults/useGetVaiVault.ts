import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetBalanceOf, useGetVaiVaultUserInfo, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { useGetVaiVaultContractAddress } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { Vault } from 'types';
import { convertMantissaToTokens } from 'utilities';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const vaiVaultContractAddress = useGetVaiVaultContractAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: totalVaiStakedData, isLoading: isGetTotalVaiStakedMantissaLoading } =
    useGetBalanceOf(
      {
        accountAddress: vaiVaultContractAddress || '',
        token: vai,
      },
      {
        enabled: !!vaiVaultContractAddress,
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

  const { data: vaiVaultDailyRateData, isLoading: isGetVaiVaultDailyRateMantissaLoading } =
    useGetVenusVaiVaultDailyRate();

  // TODO: fetch price
  const isGetXvsPriceLoading = false;
  const xvsPriceDollars = new BigNumber(1);

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedData || !vaiVaultDailyRateData || !xvsPriceDollars || !xvs || !vai) {
      return undefined;
    }

    const stakingAprPercentage = convertMantissaToTokens({
      value: vaiVaultDailyRateData.dailyRateMantissa,
      token: xvs,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertMantissaToTokens({
          value: totalVaiStakedData.balanceMantissa,
          token: vai,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardToken: xvs,
      stakedToken: vai,
      dailyEmissionMantissa: vaiVaultDailyRateData.dailyRateMantissa,
      totalStakedMantissa: totalVaiStakedData.balanceMantissa,
      stakingAprPercentage,
      userStakedMantissa: vaiVaultUserInfo?.stakedVaiMantissa,
    };
  }, [xvsPriceDollars, vaiVaultUserInfo, totalVaiStakedData, vaiVaultDailyRateData, xvs, vai]);

  const isLoading =
    isGetTotalVaiStakedMantissaLoading ||
    isGetVaiVaultDailyRateMantissaLoading ||
    isGetXvsPriceLoading ||
    isGetVaiVaultUserInfoLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaiVault;
