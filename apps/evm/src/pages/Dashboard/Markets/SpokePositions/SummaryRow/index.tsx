import BigNumber from 'bignumber.js';

import {
  AccountHealthBar,
  Cell,
  CellGroup,
  type CellProps,
  HealthFactorPill,
  cn,
} from 'components';
import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import type { SpokePool } from 'types';
import {
  calculateDailyBorrowInterestCents,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

export interface SummaryRowProps {
  spokePool: SpokePool;
  className?: string;
}

const cellClassName = cn('bg-transparent px-0 max-xl:py-0 lg:border-r-dark-blue');

export const SummaryRow: React.FC<SummaryRowProps> = ({ spokePool, className }) => {
  const { t } = useTranslation();
  const [userChainSettings] = useUserChainSettings();
  const shouldHideBalances = userChainSettings.doNotShowUserBalances;

  const borrowedAssets = spokePool.assets.filter(asset =>
    asset.userBorrowBalanceCents.isGreaterThan(0),
  );

  const totalBorrowCents = borrowedAssets.reduce(
    (acc, asset) => acc.plus(asset.userBorrowBalanceCents),
    new BigNumber(0),
  );

  const weightedBorrowApyPercentage = totalBorrowCents.isGreaterThan(0)
    ? borrowedAssets
        .reduce(
          (acc, asset) =>
            acc.plus(asset.userBorrowBalanceCents.multipliedBy(asset.borrowApyPercentage)),
          new BigNumber(0),
        )
        .dividedBy(totalBorrowCents)
    : new BigNumber(0);

  const dailyBorrowInterestsCents = calculateDailyBorrowInterestCents({ assets: spokePool.assets });

  const cells: CellProps[] = [
    {
      label: t('account.spoke.summary.healthFactor'),
      value: <HealthFactorPill factor={spokePool.userHealthFactor ?? 0} showLabel />,
      className: cellClassName,
    },
    {
      label: t('account.spoke.summary.borrowApy'),
      value: (
        <HidableUserBalance>
          {formatPercentageToReadableValue(weightedBorrowApyPercentage)}
        </HidableUserBalance>
      ),
      className: cellClassName,
    },
    {
      label: t('account.spoke.summary.dailyBorrowInterest'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: dailyBorrowInterestsCents })}
        </HidableUserBalance>
      ),
      className: cellClassName,
    },
    {
      label: t('account.spoke.summary.totalSupply'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: spokePool.userSupplyBalanceCents })}
        </HidableUserBalance>
      ),
      className: cellClassName,
    },
    {
      label: t('account.spoke.summary.totalBorrow'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: spokePool.userBorrowBalanceCents })}
        </HidableUserBalance>
      ),
      className: cellClassName,
    },
    {
      value: (
        <AccountHealthBar
          borrowBalanceCents={spokePool.userBorrowBalanceCents?.toNumber() ?? 0}
          borrowBalanceProtectedCents={spokePool.userBorrowBalanceProtectedCents?.toNumber()}
          borrowLimitCents={spokePool.userBorrowLimitCents?.toNumber() ?? 0}
          borrowLimitProtectedCents={spokePool.userBorrowLimitProtectedCents?.toNumber()}
          liquidationThresholdCents={spokePool.userLiquidationThresholdCents?.toNumber()}
          hideUserBalances={shouldHideBalances ? HIDDEN_BALANCE_KEY : undefined}
        />
      ),
      className: cellClassName,
    },
  ];

  return (
    <>
      <div className={cn('space-y-4 md:space-y-6 xl:hidden', className)}>
        {cells.map(cell => (
          <Cell key={`spoke-summary-cell-${cell.label}`} {...cell} />
        ))}
      </div>

      <CellGroup
        cells={cells}
        className={cn('hidden xl:flex xl:bg-transparent xl:p-0', className)}
      />
    </>
  );
};
