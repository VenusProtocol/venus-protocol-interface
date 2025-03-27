import { useMemo } from 'react';

import {
  useGetBalanceOf,
  useGetTokenUsdPrice,
  useGetVaiVaultPaused,
  useGetVaiVaultUserInfo,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { DAYS_PER_YEAR } from 'constants/time';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import type { Vault } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

export const useGetVaiVault = ({
  accountAddress,
}: { accountAddress?: Address }): UseGetVaiVaultOutput => {
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
        accountAddress: vaiVaultContractAddress || NULL_ADDRESS,
        token: vai,
      },
      {
        enabled: !!vaiVaultContractAddress && !!vai,
      },
    );

  const { data: vaiVaultUserInfo, isLoading: isGetVaiVaultUserInfoLoading } =
    useGetVaiVaultUserInfo(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
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
