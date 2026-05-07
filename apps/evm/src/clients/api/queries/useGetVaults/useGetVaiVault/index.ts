import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  useGetBalanceOf,
  useGetTokenListUsdPrice,
  useGetVaiVaultPaused,
  useGetVaiVaultUserInfo,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { DAYS_PER_YEAR } from 'constants/time';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { VenusVault } from 'types';
import { convertDollarsToCents, convertMantissaToTokens } from 'utilities';
import { checkIsXvsOnZk } from 'utilities/xvsPriceOnZk';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import type { Address } from 'viem';
import { calculateVaultCentsValues } from '../calculateVaultCentsValues';
import { formatToVenusVault } from '../formatToVenusVault';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: VenusVault | undefined;
}

export const useGetVaiVault = ({
  accountAddress,
}: { accountAddress?: Address }): UseGetVaiVaultOutput => {
  const { chainId } = useChainId();

  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

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

  const { data: tokenPricesData, isLoading: isGetTokenPricesLoading } = useGetTokenListUsdPrice(
    {
      tokens: xvs && vai ? [xvs, vai] : [],
    },
    {
      enabled: !!xvs && !!vai,
    },
  );

  const isXvsOnZk = checkIsXvsOnZk({
    chainId,
    xvs,
    token: xvs,
  });

  const xvsPriceDollars = isXvsOnZk
    ? new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2)
    : tokenPricesData?.[0]?.tokenPriceUsd;

  const data = useMemo(() => {
    if (
      !totalVaiStakedData ||
      !vaiVaultDailyRateData ||
      !xvsPriceDollars ||
      !tokenPricesData?.[1]?.tokenPriceUsd ||
      !xvs ||
      !vai ||
      !getVaiVaultPausedData
    ) {
      return undefined;
    }

    const stakedTokenPriceCents = convertDollarsToCents(tokenPricesData[1].tokenPriceUsd);
    const rewardTokenPriceCents = convertDollarsToCents(xvsPriceDollars);

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

    const { stakeBalanceCents, userStakeBalanceCents, dailyEmissionCents } =
      calculateVaultCentsValues({
        stakedTokenDecimals: vai.decimals,
        rewardTokenDecimals: xvs.decimals,
        stakedTokenPriceCents,
        rewardTokenPriceCents,
        stakeBalanceMantissa: totalVaiStakedData.balanceMantissa,
        userStakeBalanceMantissa: vaiVaultUserInfo?.stakedVaiMantissa,
        dailyEmissionMantissa: vaiVaultDailyRateData.dailyRateMantissa,
      });

    if (dailyEmissionCents === undefined) {
      return undefined;
    }

    return formatToVenusVault({
      isPaused: getVaiVaultPausedData.isVaultPaused,
      rewardToken: xvs,
      stakedToken: vai,
      stakedTokenPriceCents,
      rewardTokenPriceCents,
      dailyEmissionMantissa: vaiVaultDailyRateData.dailyRateMantissa,
      dailyEmissionCents,
      stakeBalanceMantissa: totalVaiStakedData.balanceMantissa,
      stakeBalanceCents,
      stakingAprPercentage,
      userStakeBalanceMantissa: vaiVaultUserInfo?.stakedVaiMantissa,
      userStakeBalanceCents,
    });
  }, [
    tokenPricesData,
    vaiVaultUserInfo,
    totalVaiStakedData,
    vaiVaultDailyRateData,
    xvs,
    vai,
    getVaiVaultPausedData,
    xvsPriceDollars,
  ]);

  const isLoading =
    isGetTotalVaiStakedMantissaLoading ||
    isGetVaiVaultDailyRateMantissaLoading ||
    isGetTokenPricesLoading ||
    isGetVaiVaultUserInfoLoading ||
    isGetVaiVaultPausedLoading;

  return {
    data,
    isLoading,
  };
};
