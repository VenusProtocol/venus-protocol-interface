import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { keepPreviousData } from '@tanstack/react-query';
import {
  useGetHypotheticalPrimeApys,
  useGetPrimeStatus,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, TokenAction } from 'types';
import { convertTokensToMantissa } from 'utilities';

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
  const { accountAddress } = useAccountAddress();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: getPrimeStatusData } = useGetPrimeStatus(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const xvsVaultPoolIndex = getPrimeStatusData?.xvsVaultPoolId;

  const { data: getXvsVaultUserInfoData } = useGetXvsVaultUserInfo(
    {
      poolIndex: xvsVaultPoolIndex || 0,
      rewardTokenAddress: xvs?.address || '',
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress && !!xvs && typeof xvsVaultPoolIndex === 'number',
    },
  );
  const userXvsStakedMantissa = getXvsVaultUserInfoData?.stakedAmountMantissa;

  const shouldFetchHypotheticalUserPrimeApy = asset.borrowTokenDistributions
    .concat(asset.supplyTokenDistributions)
    .some(distribution => distribution.type === 'prime');

  const { userBorrowBalanceMantissa, userSupplyBalanceMantissa } = useMemo(() => {
    let hypotheticalUserBorrowBalanceTokens = asset.userBorrowBalanceTokens;
    let hypotheticalUserSupplyBalanceTokens = asset.userSupplyBalanceTokens;

    if (action === 'borrow') {
      hypotheticalUserBorrowBalanceTokens = asset.userBorrowBalanceTokens.plus(toTokenAmountTokens);
    } else if (action === 'repay') {
      hypotheticalUserBorrowBalanceTokens =
        asset.userBorrowBalanceTokens.minus(toTokenAmountTokens);
    } else if (action === 'supply' || action === 'swapAndSupply') {
      hypotheticalUserSupplyBalanceTokens = asset.userSupplyBalanceTokens.plus(toTokenAmountTokens);
    } else if (action === 'withdraw') {
      hypotheticalUserSupplyBalanceTokens =
        asset.userSupplyBalanceTokens.minus(toTokenAmountTokens);
    }

    if (hypotheticalUserBorrowBalanceTokens.isLessThan(0)) {
      hypotheticalUserBorrowBalanceTokens = new BigNumber(0);
    }

    if (hypotheticalUserSupplyBalanceTokens.isLessThan(0)) {
      hypotheticalUserSupplyBalanceTokens = new BigNumber(0);
    }

    return {
      userBorrowBalanceMantissa: convertTokensToMantissa({
        value: hypotheticalUserBorrowBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
      userSupplyBalanceMantissa: convertTokensToMantissa({
        value: hypotheticalUserSupplyBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    };
  }, [
    asset.vToken.underlyingToken,
    asset.userBorrowBalanceTokens,
    asset.userSupplyBalanceTokens,
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
      placeholderData: keepPreviousData,
    },
  );

  if (toTokenAmountTokens.isEqualTo(0)) {
    return {
      borrowApy: undefined,
      supplyApy: undefined,
    };
  }

  return {
    borrowApy: getHypotheticalPrimeApysData?.borrowApyPercentage,
    supplyApy: getHypotheticalPrimeApysData?.supplyApyPercentage,
  };
};
