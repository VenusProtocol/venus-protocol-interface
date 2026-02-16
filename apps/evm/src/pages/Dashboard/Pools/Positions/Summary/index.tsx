import type BigNumber from 'bignumber.js';
import { AccountHealthBar, Card, Cell, CellGroup, type CellProps, cn } from 'components';
import type { Pool, Vault } from 'types';

import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import {
  formatCentsToReadableValue,
  formatHealthFactorToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import Section from '../../../Section';
import { useExtractData } from '../../../useExtractData';

export interface SummaryProps {
  pool: Pool;
  vaults?: Vault[];
  title?: string;
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  displayHealthFactor?: boolean;
  displayAccountHealth?: boolean;
  className?: string;
}

export const Summary: React.FC<SummaryProps> = ({
  pool,
  vaults,
  title,
  displayHealthFactor = false,
  displayAccountHealth = false,
  xvsPriceCents,
  vaiPriceCents,
  className,
}) => {
  const { t } = useTranslation();

  const { netApyPercentage, dailyEarningsCents, totalVaultStakeCents } = useExtractData({
    pools: [pool],
    vaults,
    xvsPriceCents,
    vaiPriceCents,
  });

  const { textClass } = useHealthFactor({ value: pool.userHealthFactor || 0 });

  const cells: CellProps[] = displayHealthFactor
    ? [
        {
          label: t('account.summary.cellGroup.healthFactor'),
          value: formatHealthFactorToReadableValue({ value: pool.userHealthFactor || 0 }),
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
      value: formatCentsToReadableValue({ value: pool.userSupplyBalanceCents }),
    },
    {
      label: t('account.summary.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: pool.userBorrowBalanceCents }),
    },
  );

  if (totalVaultStakeCents) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
    });
  }

  if (displayAccountHealth) {
    cells.push({
      value: (
        <AccountHealthBar
          borrowBalanceCents={pool.userBorrowBalanceCents?.toNumber() ?? 0}
          borrowLimitCents={pool.userBorrowLimitCents?.toNumber() ?? 0}
        />
      ),
    });
  }

  return (
    <Section className={className} title={title}>
      {/* XS view when displaying account health */}
      <div className={cn('space-y-2', displayAccountHealth ? 'sm:hidden' : 'hidden')}>
        <CellGroup cells={cells.slice(0, cells.length - 1)} variant="tertiary" />

        <Cell {...cells[cells.length - 1]} className="rounded-xl bg-cards p-4" />
      </div>

      <CellGroup
        cells={cells}
        className={cn(displayAccountHealth && 'hidden sm:grid xl:hidden')}
        variant="tertiary"
      />

      {/* XL view when displaying account health */}
      <Card className={cn('hidden justify-between', displayAccountHealth && 'xl:flex')}>
        <CellGroup
          cells={cells.slice(0, cells.length - 1)}
          className="w-full xl:p-0"
          variant="secondary"
        />

        {/* Account health */}
        <div className="shrink-0">{cells[cells.length - 1].value}</div>
      </Card>
    </Section>
  );
};
