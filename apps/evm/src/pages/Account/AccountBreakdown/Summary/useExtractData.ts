import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Pool, Vault } from 'types';
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

    const healthFactor = calculateHealthFactor({
      borrowBalanceCents: totalBorrowCents.toNumber(),
      borrowLimitCents: borrowLimitCents.toNumber(),
    });

    return {
      dailyEarningsCents: dailyEarningsCentsTmp,
      netApyPercentage: netApyPercentageTmp,
      totalVaultStakeCents,
      totalBorrowCents,
      totalSupplyCents,
      healthFactor,
    };
  }, [pools, vaults, xvsPriceCents, vaiPriceCents]);

export default useExtractData;
