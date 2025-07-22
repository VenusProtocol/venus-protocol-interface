import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { AccountHealthBar, Card, type Cell, CellGroup } from 'components';
import { HealthFactor } from 'components/HealthFactor';
import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import type { Pool, Vault } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import Section from '../Section';
import useExtractData from './useExtractData';

export interface PoolSummaryProps {
  pools: Pool[];
  variant?: 'primary' | 'secondary';
  vaults?: Vault[];
  title?: string;
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  displayHealthFactor?: boolean;
  displayAccountHealth?: boolean;
  displayTotalVaultStake?: boolean;
  className?: string;
}

export const PoolSummary: React.FC<PoolSummaryProps> = ({
  pools,
  variant = 'primary',
  vaults,
  title,
  displayHealthFactor = false,
  displayAccountHealth = false,
  displayTotalVaultStake = false,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
  className,
}) => {
  const { t } = useTranslation();

  const {
    totalSupplyCents,
    totalBorrowCents,
    totalVaultStakeCents,
    healthFactor,
    borrowLimitCents,
    dailyEarningsCents,
    netApyPercentage,
  } = useExtractData({
    pools,
    vaults: vaults || [],
    xvsPriceCents,
    vaiPriceCents,
  });

  const { textClass } = useHealthFactor({ value: healthFactor });

  const cells: Cell[] = displayHealthFactor
    ? [
        {
          label: t('account.summary.cellGroup.healthFactor'),
          value: <HealthFactor factor={healthFactor} className={cn('h-7 min-w-7', textClass)} />,
          tooltip: t('account.summary.cellGroup.healthFactorTooltip'),
          className: 'h-[30px]',
        },
      ]
    : [];

  cells.push(
    {
      label: t('account.summary.cellGroup.netApy'),
      value: formatPercentageToReadableValue(netApyPercentage),
      tooltip: displayTotalVaultStake
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

  if (displayTotalVaultStake) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
    });
  }

  return (
    <Section className={className} title={title}>
      <Card className="bg-transparent p-0 space-y-2 sm:p-0 xl:space-y-0 xl:bg-cards xl:flex xl:justify-between">
        <CellGroup smallValues={variant === 'secondary'} cells={cells} className="p-0" />

        {displayAccountHealth && (
          <AccountHealthBar
            className="bg-cards block w-full rounded-xl p-4 sm:p-4 xl:w-auto xl:p-6 xl:flex-1 xl:max-w-100"
            borrowBalanceCents={totalBorrowCents.toNumber()}
            borrowLimitCents={borrowLimitCents.toNumber()}
          />
        )}
      </Card>
    </Section>
  );
};
