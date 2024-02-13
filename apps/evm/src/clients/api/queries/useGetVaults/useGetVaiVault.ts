import { useMemo } from 'react';

import {
  useGetBalanceOf,
  useGetTokenUsdPrice,
  useGetVaiVaultPaused,
  useGetVaiVaultUserInfo,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
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

  const { data: getVaiVaultPausedData, isLoading: isGetVaiVaultPausedLoading } =
    useGetVaiVaultPaused();

  const { data: xvsPriceData, isLoading: isGetXvsPriceLoading } = useGetTokenUsdPrice(
    {
      token: xvs,
    },
    {
      enabled: !!xvs,
    },
  );

  const data: Vault | undefined = useMemo(() => {
    if (
      !totalVaiStakedData ||
      !vaiVaultDailyRateData ||
      !xvsPriceData ||
      !xvs ||
      !vai ||
      !getVaiVaultPausedData
    ) {
      return undefined;
    }

    const { tokenPriceUsd: xvsPriceDollars } = xvsPriceData;

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
      isPaused: getVaiVaultPausedData.isVaultPaused,
      rewardToken: xvs,
      stakedToken: vai,
      dailyEmissionMantissa: vaiVaultDailyRateData.dailyRateMantissa,
      totalStakedMantissa: totalVaiStakedData.balanceMantissa,
      stakingAprPercentage,
      userStakedMantissa: vaiVaultUserInfo?.stakedVaiMantissa,
    };
  }, [
    xvsPriceData,
    vaiVaultUserInfo,
    totalVaiStakedData,
    vaiVaultDailyRateData,
    xvs,
    vai,
    getVaiVaultPausedData,
  ]);

  const isLoading =
    isGetTotalVaiStakedMantissaLoading ||
    isGetVaiVaultDailyRateMantissaLoading ||
    isGetXvsPriceLoading ||
    isGetVaiVaultUserInfoLoading ||
    isGetVaiVaultPausedLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaiVault;
