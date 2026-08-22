import { CellGroup, type CellProps } from 'components';
import { useTranslation } from 'libs/translations';
import { AccountHealth } from 'pages/YieldPlus/AccountHealth';
import type { YieldPlusPosition } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface StatusTabProps {
  row: YieldPlusPosition;
}

export const StatusTab: React.FC<StatusTabProps> = ({ row }) => {
  const { t } = useTranslation();

  const cells: CellProps[] = [
    {
      label: t('yieldPlus.positions.status.collateralColumn.label'),
      value: formatTokensToReadableValue({
        value: row.dsaBalanceTokens,
        token: row.dsaAsset.vToken.underlyingToken,
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

      <AccountHealth pool={row.pool} />
    </div>
  );
};
