import {
  AccountHealthBar,
  CellGroup,
  type CellProps,
  HealthFactorPill,
  LabeledInlineContent,
} from 'components';
import { useTranslation } from 'libs/translations';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import type { Row } from '../../types';

export interface StatusTabProps {
  row: Row;
}

export const StatusTab: React.FC<StatusTabProps> = ({ row }) => {
  const { t } = useTranslation();

  const healthFactor = row.pool.userHealthFactor || 0;

  const cells: CellProps[] = [
    {
      label: t('yieldPlus.positions.status.collateralColumn.label'),
      value: formatTokensToReadableValue({
        value: row.dsaBalanceTokens,
        token: row.dsaToken,
      }),
    },
    {
      label: t('yieldPlus.positions.status.netValue.label'),
      value: formatCentsToReadableValue({
        value: row.netValueCents,
      }),
    },
    {
      label: t('yieldPlus.positions.status.netApy.label'),
      value: formatPercentageToReadableValue(row.netApyPercentage),
      className: row.netApyPercentage < 0 ? 'text-red' : 'text-green',
    },
  ];

  return (
    <div className="flex flex-col gap-6 justify-between md:flex-row lg:flex-col 2xl:flex-row">
      <CellGroup variant="secondary" cells={cells} className="md:w-auto lg:w-full 2xl:w-auto" />

      <div className="flex flex-col gap-y-3">
        <AccountHealthBar
          borrowBalanceCents={
            row.pool.userBorrowBalanceCents ? row.pool.userBorrowBalanceCents.toNumber() : 0
          }
          borrowLimitCents={
            row.pool.userBorrowLimitCents ? row.pool.userBorrowLimitCents.toNumber() : 0
          }
        />

        <LabeledInlineContent
          label={t('yieldPlus.positions.status.healthFactor.label')}
          tooltip={t('yieldPlus.positions.status.healthFactor.tooltip')}
        >
          <HealthFactorPill factor={healthFactor} showLabel />
        </LabeledInlineContent>
      </div>
    </div>
  );
};
