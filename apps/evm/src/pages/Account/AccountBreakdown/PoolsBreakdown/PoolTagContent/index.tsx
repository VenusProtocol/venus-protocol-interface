import { ProgressCircle, Tooltip } from 'components';
import type { Pool } from 'types';

import useProgressColor from 'hooks/useProgressColor';
import { useTranslation } from 'libs/translations';
import { calculatePercentage, formatPercentageToReadableValue } from 'utilities';

export interface PoolTagContentProps {
  pool: Pool;
}

export const PoolTagContent: React.FC<PoolTagContentProps> = ({ pool }) => {
  const { t } = useTranslation();

  const borrowLimitUsedPercentage =
    pool.userBorrowBalanceCents &&
    pool.userBorrowLimitCents &&
    calculatePercentage({
      numerator: pool.userBorrowBalanceCents.toNumber(),
      denominator: pool.userBorrowLimitCents.toNumber(),
    });

  const progressColor = useProgressColor(borrowLimitUsedPercentage ?? 0);

  const readableBorrowLimitUsedPercentage =
    formatPercentageToReadableValue(borrowLimitUsedPercentage);

  return (
    <>
      <span>{pool.name}</span>

      {borrowLimitUsedPercentage !== undefined && (
        <Tooltip
          title={t('account.poolsBreakdown.poolTagTooltip', {
            borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
          })}
          className="ml-1 inline-flex"
        >
          <ProgressCircle
            value={borrowLimitUsedPercentage}
            fillColor={progressColor}
            strokeWidthPx={3}
            sizePx={16}
          />
        </Tooltip>
      )}
    </>
  );
};
