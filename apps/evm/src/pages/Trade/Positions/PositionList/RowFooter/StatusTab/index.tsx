import { CellGroup, type CellProps } from 'components';
import { useTranslation } from 'libs/translations';
import { AccountHealth } from 'pages/Trade/AccountHealth';
import type { TradePosition } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface StatusTabProps {
  row: TradePosition;
}

export const StatusTab: React.FC<StatusTabProps> = ({ row }) => {
  const { t } = useTranslation();

  const cells: CellProps[] = [
    {
      label: t('trade.positions.status.collateralColumn.label'),
      value: formatTokensToReadableValue({
        value: row.dsaBalanceTokens,
        token: row.dsaAsset.vToken.underlyingToken,
      }),
    },
    {
      label: t('trade.positions.status.netValue.label'),
      value: formatCentsToReadableValue({
        value: row.netValueCents,
      }),
    },
    {
      label: t('trade.positions.status.collateralUtilizationColumn.label'),
      value: formatTokensToReadableValue({
        value: row.dsaUtilizedBalanceTokens,
        token: row.dsaAsset.vToken.underlyingToken,
      }),
    },
    {
      label: t('trade.positions.status.netApy.label'),
      value: formatPercentageToReadableValue(row.netApyPercentage),
      className: row.netApyPercentage < 0 ? 'text-red' : 'text-green',
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 gap-x-12 justify-between md:flex-row lg:flex-col 2xl:flex-row">
      <CellGroup
        cells={cells}
        className="grid grid-cols-2 md:w-auto lg:w-full xl:grid-cols-4 2xl:grid-cols-2 2xl:w-auto"
      />

      <AccountHealth pool={row.pool} />
    </div>
  );
};
