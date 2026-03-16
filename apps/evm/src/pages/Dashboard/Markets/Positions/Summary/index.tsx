import type BigNumber from 'bignumber.js';
import {
  AccountHealthBar,
  Card,
  Cell,
  CellGroup,
  type CellProps,
  HealthFactorPill,
  cn,
} from 'components';
import type { AnyVault, Pool } from 'types';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import Section from '../../../Section';
import { useExtractData } from '../../../useExtractData';

export interface SummaryProps {
  pool: Pool;
  vaults?: AnyVault[];
  title?: string;
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  displayHealthFactor?: boolean;
  displayAccountHealth?: boolean;
  className?: string;
}

const cellClassName = cn('bg-transparent px-0 max-xl:py-0 lg:border-r-dark-blue');

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

  const cells: CellProps[] = displayHealthFactor
    ? [
        {
          label: t('account.summary.cellGroup.healthFactor'),
          value: <HealthFactorPill factor={pool.userHealthFactor || 0} showLabel />,
          tooltip: t('account.summary.cellGroup.healthFactorTooltip'),
          className: cellClassName,
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
      className: cn(
        typeof netApyPercentage === 'number' && netApyPercentage < 0 ? 'text-red' : 'text-green',
        cellClassName,
      ),
    },
    {
      label: t('account.summary.cellGroup.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
      className: cellClassName,
    },
    {
      label: t('account.summary.cellGroup.totalSupply'),
      value: formatCentsToReadableValue({ value: pool.userSupplyBalanceCents }),
      className: cellClassName,
    },
    {
      label: t('account.summary.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: pool.userBorrowBalanceCents }),
      className: cellClassName,
    },
  );

  if (totalVaultStakeCents) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
      className: cellClassName,
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
      className: cellClassName,
    });
  }

  return (
    <Section className={className} title={title}>
      {/* Below XL view */}
      <div className="space-y-4 md:space-y-6 xl:hidden">
        <CellGroup
          cells={displayAccountHealth ? cells.slice(0, cells.length - 1) : cells}
          variant="tertiary"
          className={cn('gap-3', displayAccountHealth ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}
        />

        {displayAccountHealth && <Cell {...cells[cells.length - 1]} className={cellClassName} />}
      </div>

      {/* XL or above view */}
      <Card className="justify-between border-0 p-0 hidden xl:flex">
        <CellGroup
          cells={displayAccountHealth ? cells.slice(0, cells.length - 1) : cells}
          className="w-full xl:p-0"
          variant="secondary"
        />

        {/* Account health */}
        {displayAccountHealth && <div className="shrink-0">{cells[cells.length - 1].value}</div>}
      </Card>
    </Section>
  );
};
