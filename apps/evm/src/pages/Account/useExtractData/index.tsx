import BigNumber from 'bignumber.js';

import type { Pool, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
  convertMantissaToTokens,
} from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pools: Pool[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  vaiBorrowAprPercentage?: BigNumber;
  vaults?: Vault[];
}

export const useExtractData = ({
  pools,
  vaults,
  vaiBorrowAprPercentage,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
}: UseExtractDataInput) => {
  const { totalBorrowCents, totalSupplyCents, totalBorrowLimitCents, totalVaiBorrowBalanceCents } =
    pools.reduce(
      (acc, pool) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(pool.userBorrowBalanceCents || 0),
        totalSupplyCents: acc.totalSupplyCents.plus(pool.userSupplyBalanceCents || 0),
        totalBorrowLimitCents: acc.totalBorrowLimitCents.plus(pool.userBorrowLimitCents || 0),
        totalVaiBorrowBalanceCents: acc.totalVaiBorrowBalanceCents.plus(
          pool.userVaiBorrowBalanceCents || 0,
        ),
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
        totalBorrowLimitCents: new BigNumber(0),
        totalVaiBorrowBalanceCents: new BigNumber(0),
      },
    );

  let totalVaultStakeCents: BigNumber | undefined;
  let yearlyVaultEarningsCents: BigNumber | undefined;

  if (vaults) {
    vaults.forEach(vault => {
      const vaultStakeCents = convertMantissaToTokens({
        value: new BigNumber(vault.userStakedMantissa || 0),
        token: vault.stakedToken,
      }).multipliedBy(vault.stakedToken.symbol === 'XVS' ? xvsPriceCents : vaiPriceCents);

      if (!totalVaultStakeCents) {
        totalVaultStakeCents = new BigNumber(0);
      }

      if (!yearlyVaultEarningsCents) {
        yearlyVaultEarningsCents = new BigNumber(0);
      }

      totalVaultStakeCents = totalVaultStakeCents.plus(vaultStakeCents);
      yearlyVaultEarningsCents = yearlyVaultEarningsCents.plus(
        calculateYearlyInterests({
          balance: vaultStakeCents,
          interestPercentage: new BigNumber(vault.stakingAprPercentage),
        }),
      );
    });
  }

  const yearlyAssetEarningsCents = pools.reduce((acc, pool) => {
    const yearlyPoolAssetsEarningsCents = calculateYearlyEarningsForAssets({
      assets: pool.assets,
    });

    return acc.plus(yearlyPoolAssetsEarningsCents || 0);
  }, new BigNumber(0));

  let vaiYearlyBorrowInterestsCents: BigNumber | undefined;

  if (vaiBorrowAprPercentage) {
    vaiYearlyBorrowInterestsCents = totalVaiBorrowBalanceCents
      .multipliedBy(vaiBorrowAprPercentage)
      .div(100);
  }

  const yearlyEarningsCents = yearlyAssetEarningsCents
    .plus(yearlyVaultEarningsCents || 0)
    .minus(vaiYearlyBorrowInterestsCents || 0);
  const dailyEarningsCents = calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

  const netApyPercentage =
    yearlyAssetEarningsCents &&
    calculateNetApy({
      supplyBalanceCents: totalSupplyCents.plus(totalVaultStakeCents || 0),
      yearlyEarningsCents,
    });

  return {
    totalVaultStakeCents,
    totalBorrowCents,
    totalSupplyCents,
    totalBorrowLimitCents,
    totalVaiBorrowBalanceCents,
    dailyEarningsCents,
    netApyPercentage,
  };
};
