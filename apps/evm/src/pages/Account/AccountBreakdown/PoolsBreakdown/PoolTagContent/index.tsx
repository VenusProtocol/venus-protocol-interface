import { ProgressCircle, Tooltip } from 'components';
import type { Pool } from 'types';

import { theme } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { calculatePercentage, formatPercentageToReadableValue } from 'utilities';

export interface PoolTagContentProps {
  pool: Pool;
}

export const PoolTagContent: React.FC<PoolTagContentProps> = ({ pool }) => {
  const { t } = useTranslation();

  const borrowLimitUsedPercentage =
    pool.userBorrowBalanceCents && pool.userBorrowLimitCents
      ? calculatePercentage({
          numerator: pool.userBorrowBalanceCents.toNumber(),
          denominator: pool.userBorrowLimitCents.toNumber(),
        })
      : 0;

  const readableBorrowLimitUsedPercentage =
    formatPercentageToReadableValue(borrowLimitUsedPercentage);

  let fillColor = theme.colors.red;

  if (borrowLimitUsedPercentage <= 66) {
    fillColor = theme.colors.green;
  } else if (borrowLimitUsedPercentage <= 50) {
    fillColor = theme.colors.yellow;
  }

  return (
    <>
      <span>{pool.name}</span>

      {borrowLimitUsedPercentage !== undefined && (
        <Tooltip
          content={t('account.poolsBreakdown.poolTagTooltip', {
            borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
          })}
          className="ml-1 inline-flex"
        >
          <ProgressCircle
            value={borrowLimitUsedPercentage}
            fillColor={fillColor}
            strokeWidthPx={3}
            sizePx={16}
          />
        </Tooltip>
      )}
    </>
  );
};
