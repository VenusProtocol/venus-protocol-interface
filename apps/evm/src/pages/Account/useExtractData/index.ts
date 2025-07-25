import BigNumber from 'bignumber.js';

import type { CellProps } from 'components';
import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import type { Pool, Vault } from 'types';
import {
  calculateDailyEarningsCents,
  calculateHealthFactor,
  calculateYearlyEarningsForAssets,
  calculateYearlyInterests,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatHealthFactorToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import calculateNetApy from './calculateNetApy';

interface UseExtractDataInput {
  pools: Pool[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  vaults?: Vault[];
  includeHealthFactor?: boolean;
}

export const useExtractData = ({
  pools,
  vaults,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
  includeHealthFactor = false,
}: UseExtractDataInput) => {
  const { t } = useTranslation();

  const { totalBorrowCents, totalSupplyCents, borrowLimitCents, liquidationThresholdCents } =
    pools.reduce(
      (acc, pool) => ({
        totalBorrowCents: acc.totalBorrowCents.plus(pool.userBorrowBalanceCents || 0),
        totalSupplyCents: acc.totalSupplyCents.plus(pool.userSupplyBalanceCents || 0),
        borrowLimitCents: acc.borrowLimitCents.plus(pool.userBorrowLimitCents || 0),
        liquidationThresholdCents: acc.liquidationThresholdCents.plus(
          pool.userLiquidationThresholdCents || 0,
        ),
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
        borrowLimitCents: new BigNumber(0),
        liquidationThresholdCents: new BigNumber(0),
      },
    );

  const { totalVaultStakeCents, yearlyVaultEarningsCents } = (vaults || []).reduce(
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
  const dailyEarningsCents = calculateDailyEarningsCents(yearlyEarningsCents).toNumber();

  const netApyPercentage =
    yearlyAssetEarningsCents &&
    calculateNetApy({
      supplyBalanceCents: totalSupplyCents.plus(totalVaultStakeCents),
      yearlyEarningsCents,
    });

  const healthFactor = calculateHealthFactor({
    borrowBalanceCents: totalBorrowCents.toNumber(),
    liquidationThresholdCents: liquidationThresholdCents.toNumber(),
  });

  const { textClass } = useHealthFactor({ value: healthFactor });

  const cells: CellProps[] = includeHealthFactor
    ? [
        {
          label: t('account.summary.cellGroup.healthFactor'),
          value: formatHealthFactorToReadableValue({ value: healthFactor }),
          tooltip: t('account.summary.cellGroup.healthFactorTooltip'),
          className: textClass,
        },
      ]
    : [];

  cells.push(
    {
      label: t('account.summary.cellGroup.netApy'),
      value: formatPercentageToReadableValue(netApyPercentage),
      tooltip: vaults
        ? t('account.summary.cellGroup.netApyWithVaultStakeTooltip')
        : t('account.summary.cellGroup.netApyTooltip'),
      className:
        typeof netApyPercentage === 'number' && netApyPercentage < 0 ? 'text-red' : 'text-green',
    },
    {
      label: t('account.summary.cellGroup.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
    },
    {
      label: t('account.summary.cellGroup.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('account.summary.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
  );

  if (vaults) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
    });
  }

  return {
    totalVaultStakeCents,
    totalBorrowCents,
    borrowLimitCents,
    cells,
  };
};
