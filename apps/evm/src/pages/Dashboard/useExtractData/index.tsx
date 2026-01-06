import BigNumber from 'bignumber.js';

import type { Pool, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateYearlyInterests,
  convertMantissaToTokens,
} from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pools: Pool[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  vaults?: Vault[];
}

export const useExtractData = ({
  pools,
  vaults,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
}: UseExtractDataInput) => {
  const {
    totalBorrowCents,
    totalSupplyCents,
    totalBorrowLimitCents,
    totalVaiBorrowBalanceCents,
    totalYearlyEarningsCents,
  } = pools.reduce(
    (acc, pool) => ({
      totalBorrowCents: acc.totalBorrowCents.plus(pool.userBorrowBalanceCents || 0),
      totalSupplyCents: acc.totalSupplyCents.plus(pool.userSupplyBalanceCents || 0),
      totalBorrowLimitCents: acc.totalBorrowLimitCents.plus(pool.userBorrowLimitCents || 0),
      totalVaiBorrowBalanceCents: acc.totalVaiBorrowBalanceCents.plus(
        pool.vai?.userBorrowBalanceCents || 0,
      ),
      totalYearlyEarningsCents: acc.totalYearlyEarningsCents.plus(
        pool.userYearlyEarningsCents || 0,
      ),
    }),
    {
      totalSupplyCents: new BigNumber(0),
      totalBorrowCents: new BigNumber(0),
      totalBorrowLimitCents: new BigNumber(0),
      totalVaiBorrowBalanceCents: new BigNumber(0),
      totalYearlyEarningsCents: new BigNumber(0),
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

  const supplyBalanceCents = totalSupplyCents.plus(totalVaultStakeCents || 0);
  const yearlyEarningsCents = totalYearlyEarningsCents.plus(yearlyVaultEarningsCents || 0);

  const netApyPercentage = calculateNetApy({
    supplyBalanceCents,
    yearlyEarningsCents,
  });

  const dailyEarningsCents = calculateDailyEarningsCents(yearlyEarningsCents);

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
