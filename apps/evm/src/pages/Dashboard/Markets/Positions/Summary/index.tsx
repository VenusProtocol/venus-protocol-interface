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

import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
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
  const [userChainSettings] = useUserChainSettings();
  const shouldHideBalances = userChainSettings.doNotShowUserBalances;

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
          className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
        },
      ]
    : [];

  cells.push(
    {
      label: t('account.summary.cellGroup.netApy'),
      value: (
        <HidableUserBalance>{formatPercentageToReadableValue(netApyPercentage)}</HidableUserBalance>
      ),
      tooltip: vaults
        ? t('account.summary.cellGroup.netApyWithVaultStakeTooltip')
        : t('account.summary.cellGroup.netApyTooltip'),
      className: cn(
        typeof netApyPercentage === 'number' && netApyPercentage < 0 ? 'text-red' : 'text-green',
        'bg-transparent px-0 py-0 lg:border-r-dark-blue',
      ),
    },
    {
      label: t('account.summary.cellGroup.dailyEarnings'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: dailyEarningsCents })}
        </HidableUserBalance>
      ),
      className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
    },
    {
      label: t('account.summary.cellGroup.totalSupply'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: pool.userSupplyBalanceCents })}
        </HidableUserBalance>
      ),
      className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
    },
    {
      label: t('account.summary.cellGroup.totalBorrow'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: pool.userBorrowBalanceCents })}
        </HidableUserBalance>
      ),
      className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
    },
  );

  if (totalVaultStakeCents) {
    cells.push({
      label: t('account.summary.cellGroup.totalVaultStake'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: totalVaultStakeCents })}
        </HidableUserBalance>
      ),
      className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
    });
  }

  if (displayAccountHealth) {
    cells.push({
      value: (
        <AccountHealthBar
          borrowBalanceCents={pool.userBorrowBalanceCents?.toNumber() ?? 0}
          borrowBalanceProtectedCents={pool.userBorrowBalanceProtectedCents?.toNumber()}
          borrowLimitCents={pool.userBorrowLimitCents?.toNumber() ?? 0}
          borrowLimitProtectedCents={pool.userBorrowLimitProtectedCents?.toNumber()}
          liquidationThresholdCents={pool.userLiquidationThresholdCents?.toNumber()}
          hideUserBalances={shouldHideBalances ? HIDDEN_BALANCE_KEY : undefined}
        />
      ),
      className: 'bg-transparent px-0 py-0 lg:border-r-dark-blue',
    });
  }

  return (
    <Section className={className} title={title}>
      {/* Below XL view */}
      <div className="space-y-4 md:space-y-6 xl:hidden">
        <CellGroup
          cells={displayAccountHealth ? cells.slice(0, cells.length - 1) : cells}
          grid
          className={cn(displayAccountHealth ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}
        />

        {displayAccountHealth && (
          <Cell
            {...cells[cells.length - 1]}
            className="bg-transparent px-0 py-0 lg:border-r-dark-blue"
          />
        )}
      </div>

      {/* XL or above view */}
      <Card className="hidden justify-between border-0 p-0 xl:flex">
        <CellGroup
          cells={displayAccountHealth ? cells.slice(0, cells.length - 1) : cells}
          className="w-full xl:p-0"
        />

        {/* Account health */}
        {displayAccountHealth && (
          <div className="min-w-96 shrink-0">{cells[cells.length - 1].value}</div>
        )}
      </Card>
    </Section>
  );
};
