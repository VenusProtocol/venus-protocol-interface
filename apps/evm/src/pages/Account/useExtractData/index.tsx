import BigNumber from 'bignumber.js';

import type { Pool, Token, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateHealthFactor,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
  convertMantissaToTokens,
} from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pools: Pool[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  vaults?: Vault[];
  vai?: Token;
  userVaiBorrowBalanceMantissa?: BigNumber;
}

export const useExtractData = ({
  pools,
  vaults,
  vai,
  userVaiBorrowBalanceMantissa,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
}: UseExtractDataInput) => {
  const { totalBorrowCents, totalSupplyCents, totalBorrowLimitCents, liquidationThresholdCents } =
    pools.reduce(
      (acc, pool) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(pool.userBorrowBalanceCents || 0),
        totalSupplyCents: acc.totalSupplyCents.plus(pool.userSupplyBalanceCents || 0),
        totalBorrowLimitCents: acc.totalBorrowLimitCents.plus(pool.userBorrowLimitCents || 0),
        liquidationThresholdCents: acc.liquidationThresholdCents.plus(
          pool.userLiquidationThresholdCents || 0,
        ),
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
        totalBorrowLimitCents: new BigNumber(0),
        liquidationThresholdCents: new BigNumber(0),
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

  let totalVaiBorrowBalanceCents: BigNumber | undefined;

  if (userVaiBorrowBalanceMantissa && vaiPriceCents && vai) {
    const userVaiBorrowBalanceTokens = convertMantissaToTokens({
      value: userVaiBorrowBalanceMantissa,
      token: vai,
    });

    totalVaiBorrowBalanceCents = userVaiBorrowBalanceTokens.multipliedBy(vaiPriceCents);
  }

  const yearlyEarningsCents = yearlyAssetEarningsCents.plus(yearlyVaultEarningsCents || 0);
  const dailyEarningsCents = calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

  const netApyPercentage =
    yearlyAssetEarningsCents &&
    calculateNetApy({
      supplyBalanceCents: totalSupplyCents.plus(totalVaultStakeCents || 0),
      yearlyEarningsCents,
    });

  const healthFactor = calculateHealthFactor({
    borrowBalanceCents: totalBorrowCents.toNumber(),
    liquidationThresholdCents: liquidationThresholdCents.toNumber(),
  });

  return {
    totalVaultStakeCents,
    totalBorrowCents,
    totalSupplyCents,
    totalBorrowLimitCents,
    totalVaiBorrowBalanceCents,
    dailyEarningsCents,
    netApyPercentage,
    healthFactor,
  };
};
