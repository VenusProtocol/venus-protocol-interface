import { useMemo } from 'react';
import { Vault } from 'types';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import {
  useGetBalanceOf,
  useGetMainPool,
  useGetVaiVaultUserInfo,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import useGetToken from 'hooks/useGetToken';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const vaiVaultContractAddress = useGetUniqueContractAddress({
    name: 'vaiVault',
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: totalVaiStakedData, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: vaiVaultContractAddress || '',
      token: vai!, // We ensure vai exists through the enabled option
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      enabled: !!vaiVaultContractAddress && !!vai,
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

  const { data: vaiVaultDailyRateData, isLoading: isGetVaiVaultDailyRateWeiLoading } =
    useGetVenusVaiVaultDailyRate();

  const { data: getMainPoolData, isLoading: isGetMainPoolLoading } = useGetMainPool({
    accountAddress,
  });
  const xvsPriceDollars = useMemo(() => {
    if (!xvs || !getMainPoolData?.pool.assets) {
      return undefined;
    }

    return getMainPoolData.pool.assets
      .find(asset => areTokensEqual(asset.vToken.underlyingToken, xvs))
      ?.tokenPriceCents.dividedBy(100);
  }, [getMainPoolData?.pool.assets, xvs]);

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedData || !vaiVaultDailyRateData || !xvsPriceDollars || !xvs || !vai) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: vaiVaultDailyRateData.dailyRateWei,
      token: xvs,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalVaiStakedData.balanceWei,
          token: vai,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardToken: xvs,
      stakedToken: vai,
      dailyEmissionWei: vaiVaultDailyRateData.dailyRateWei,
      totalStakedWei: totalVaiStakedData.balanceWei,
      stakingAprPercentage,
      userStakedWei: vaiVaultUserInfo?.stakedVaiWei,
    };
  }, [
    totalVaiStakedData?.balanceWei.toFixed(),
    vaiVaultDailyRateData?.dailyRateWei.toFixed(),
    xvsPriceDollars?.toFixed(),
    JSON.stringify(vaiVaultUserInfo),
    xvs,
    vai,
  ]);

  const isLoading =
    isGetTotalVaiStakedWeiLoading ||
    isGetVaiVaultDailyRateWeiLoading ||
    isGetMainPoolLoading ||
    isGetVaiVaultUserInfoLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaiVault;
