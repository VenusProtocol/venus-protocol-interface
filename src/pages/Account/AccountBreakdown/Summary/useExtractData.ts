import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { Pool, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pools: Pool[];
  vaults: Vault[];
  xvsPriceCents: BigNumber;
  vaiPriceCents: BigNumber;
}

const useExtractData = ({ pools, vaults, xvsPriceCents, vaiPriceCents }: UseExtractDataInput) =>
  useMemo(() => {
    const { totalBorrowCents, totalSupplyCents, borrowLimitCents } = pools.reduce(
      (acc, pool) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(pool.userBorrowBalanceCents || 0),
        totalSupplyCents: acc.totalSupplyCents.plus(pool.userSupplyBalanceCents || 0),
        borrowLimitCents: acc.borrowLimitCents.plus(pool.userBorrowLimitCents || 0),
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
        borrowLimitCents: new BigNumber(0),
      },
    );

    const { totalVaultStakeCents, yearlyVaultEarningsCents } = vaults.reduce(
      (accTotalVaultStakeCents, vault) => {
        const vaultStakeCents = convertMantissaToTokens({
          value: new BigNumber(vault.userStakedMantissa || 0),
          token: vault.stakedToken,
        }).multipliedBy(vault.stakedToken.symbol === 'XVS' ? xvsPriceCents : vaiPriceCents);

        return {
          totalVaultStakeCents: accTotalVaultStakeCents.totalVaultStakeCents.plus(vaultStakeCents),
          yearlyVaultEarningsCents: accTotalVaultStakeCents.yearlyVaultEarningsCents.plus(
            calculateYearlyInterests({
              balance: vaultStakeCents,
              interestPercentage: new BigNumber(vault.stakingAprPercentage),
            }),
          ),
        };
      },
      { totalVaultStakeCents: new BigNumber(0), yearlyVaultEarningsCents: new BigNumber(0) },
    );

    const yearlyAssetEarningsCents = pools.reduce((acc, pool) => {
      const yearlyPoolAssetsEarningsCents = calculateYearlyEarningsForAssets({
        assets: pool.assets,
      });

      return acc.plus(yearlyPoolAssetsEarningsCents || 0);
    }, new BigNumber(0));

    const yearlyEarningsCents = yearlyAssetEarningsCents.plus(yearlyVaultEarningsCents);
    const dailyEarningsCentsTmp = calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

    const netApyPercentageTmp =
      yearlyAssetEarningsCents &&
      calculateNetApy({
        supplyBalanceCents: totalSupplyCents.plus(totalVaultStakeCents),
        yearlyEarningsCents,
      });

    const safeBorrowLimitCentsTmp = borrowLimitCents.multipliedBy(
      SAFE_BORROW_LIMIT_PERCENTAGE / 100,
    );

    const readableSafeBorrowLimitTmp = formatCentsToReadableValue({
      value: safeBorrowLimitCentsTmp,
    });

    const safeBorrowLimitPercentageTmp = formatPercentageToReadableValue(
      safeBorrowLimitCentsTmp.multipliedBy(100).dividedBy(borrowLimitCents),
    );

    return {
      dailyEarningsCents: dailyEarningsCentsTmp,
      netApyPercentage: netApyPercentageTmp,
      readableSafeBorrowLimit: readableSafeBorrowLimitTmp,
      safeBorrowLimitPercentage: safeBorrowLimitPercentageTmp,
      totalVaultStakeCents,
      totalBorrowCents,
      totalSupplyCents,
      borrowLimitCents,
    };
  }, [pools, vaults, xvsPriceCents, vaiPriceCents]);

export default useExtractData;
