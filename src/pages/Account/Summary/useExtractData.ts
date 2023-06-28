import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Pool, Vault } from 'types';
import {
  areTokensEqual,
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
  convertWeiToTokens,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';

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
        const vaultStakeCents = convertWeiToTokens({
          valueWei: new BigNumber(vault.userStakedWei || 0),
          token: vault.stakedToken,
        }).multipliedBy(
          areTokensEqual(vault.stakedToken, TOKENS.xvs) ? xvsPriceCents : vaiPriceCents,
        );

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

    const assets = pools.reduce((acc, pool) => [...acc, ...pool.assets], [] as Asset[]);

    const yearlyAssetEarningsCents = new BigNumber(
      calculateYearlyEarningsForAssets({
        assets,
      }) || 0,
    );

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

    const safeBorrowLimitPercentageTmp = formatToReadablePercentage(
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
