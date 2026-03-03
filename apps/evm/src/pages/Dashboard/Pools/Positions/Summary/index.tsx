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
import type { Pool, Vault } from 'types';

import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
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

const cellClassName = 'bg-transparent max-lg:px-0';

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
          value: <HealthFactorPill factor={pool.userHealthFactor || 0} showLabel />,
          tooltip: t('account.summary.cellGroup.healthFactorTooltip'),
          className: cn(textClass, cellClassName),
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
      {/* non-XL view when displaying account health */}
      <div className={cn('space-y-2', displayAccountHealth ? 'xl:hidden' : 'hidden')}>
        <CellGroup
          cells={cells.slice(0, cells.length - 1)}
          variant="tertiary"
          className="sm:grid-cols-3"
        />

        <Cell {...cells[cells.length - 1]} className={cellClassName} />
      </div>

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
