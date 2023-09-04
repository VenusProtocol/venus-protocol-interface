import BigNumber from 'bignumber.js';
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
import { TOKENS } from 'constants/tokens';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

export interface UseGetVaiVaultOutput {
  isLoading: boolean;
  data: Vault | undefined;
}

const useGetVaiVault = ({ accountAddress }: { accountAddress?: string }): UseGetVaiVaultOutput => {
  const vaiVaultContractAddress = useGetUniqueContractAddress({
    name: 'vaiVault',
  });

  const { data: totalVaiStakedData, isLoading: isGetTotalVaiStakedWeiLoading } = useGetBalanceOf(
    {
      accountAddress: vaiVaultContractAddress || '',
      token: TOKENS.vai,
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
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

  const { data: vaiVaultDailyRateData, isLoading: isGetVaiVaultDailyRateWeiLoading } =
    useGetVenusVaiVaultDailyRate();

  const { data: getMainPoolData, isLoading: isGetMainPoolLoading } = useGetMainPool({
    accountAddress,
  });
  const xvsPriceDollars: BigNumber | undefined = useMemo(
    () =>
      (getMainPoolData?.pool.assets || [])
        .find(asset => areTokensEqual(asset.vToken.underlyingToken, TOKENS.xvs))
        ?.tokenPriceCents.dividedBy(100),
    [getMainPoolData?.pool.assets],
  );

  const data: Vault | undefined = useMemo(() => {
    if (!totalVaiStakedData || !vaiVaultDailyRateData || !xvsPriceDollars) {
      return undefined;
    }

    const stakingAprPercentage = convertWeiToTokens({
      valueWei: vaiVaultDailyRateData.dailyRateWei,
      token: TOKENS.xvs,
    })
      .multipliedBy(xvsPriceDollars) // We assume 1 VAI = 1 dollar
      .multipliedBy(DAYS_PER_YEAR)
      .dividedBy(
        convertWeiToTokens({
          valueWei: totalVaiStakedData.balanceWei,
          token: TOKENS.vai,
        }),
      )
      .multipliedBy(100)
      .toNumber();

    return {
      rewardToken: TOKENS.xvs,
      stakedToken: TOKENS.vai,
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
