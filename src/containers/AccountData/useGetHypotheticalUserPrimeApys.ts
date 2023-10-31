import BigNumber from 'bignumber.js';
import { useGetToken } from 'packages/tokens';
import { useMemo } from 'react';
import { Asset, TokenAction } from 'types';
import { convertTokensToWei } from 'utilities';

import { useGetHypotheticalPrimeApys, useGetXvsVaultUserInfo } from 'clients/api';
import { useAuth } from 'context/AuthContext';

export interface UseGetHypotheticalUserPrimeApysInput {
  asset: Asset;
  action: TokenAction;
  toTokenAmountTokens: BigNumber;
}

export const useGetHypotheticalUserPrimeApys = ({
  asset,
  action,
  toTokenAmountTokens,
}: UseGetHypotheticalUserPrimeApysInput) => {
  const { accountAddress } = useAuth();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: getXvsVaultUserInfoData } = useGetXvsVaultUserInfo(
    {
      poolIndex: 1, // TODO: fetch from Prime contract
      rewardTokenAddress: xvs?.address || '',
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress && !!xvs,
    },
  );
  const userXvsStakedMantissa = getXvsVaultUserInfoData?.stakedAmountWei;

  const shouldFetchHypotheticalUserPrimeApy = asset.borrowDistributions
    .concat(asset.supplyDistributions)
    .some(distribution => distribution.type === 'prime');

  const { userBorrowBalanceMantissa, userSupplyBalanceMantissa } = useMemo(() => {
    const hypotheticalUserBorrowBalanceTokens =
      action === 'borrow' || action === 'repay'
        ? asset.userBorrowBalanceTokens.plus(toTokenAmountTokens)
        : asset.userBorrowBalanceTokens;

    const hypotheticalUserSupplyBalanceTokens =
      action === 'supply' || action === 'withdraw'
        ? asset.userSupplyBalanceTokens.plus(toTokenAmountTokens)
        : asset.userSupplyBalanceTokens;

    return {
      userBorrowBalanceMantissa: convertTokensToWei({
        value: hypotheticalUserBorrowBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
      userSupplyBalanceMantissa: convertTokensToWei({
        value: hypotheticalUserSupplyBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    };
  }, [
    asset.borrowBalanceTokens,
    asset.supplyBalanceTokens,
    asset.vToken.underlyingToken,
    action,
    toTokenAmountTokens,
  ]);

  const { data: getHypotheticalPrimeApysData } = useGetHypotheticalPrimeApys(
    {
      accountAddress,
      vTokenAddress: asset.vToken.address,
      userBorrowBalanceMantissa,
      userSupplyBalanceMantissa,
      userXvsStakedMantissa: userXvsStakedMantissa || new BigNumber(0),
    },
    {
      enabled: shouldFetchHypotheticalUserPrimeApy && !!userXvsStakedMantissa,
      keepPreviousData: true,
    },
  );

  if (toTokenAmountTokens.isEqualTo(0)) {
    return undefined;
  }

  return {
    borrowApy: getHypotheticalPrimeApysData?.borrowApyPercentage,
    supplyApy: getHypotheticalPrimeApysData?.supplyApyPercentage,
  };
};
