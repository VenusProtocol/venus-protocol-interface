import { ProgressCircle, Tooltip } from 'components';
import type { Pool } from 'types';

import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import {
  calculateHealthFactor,
  calculatePercentage,
  formatPercentageToReadableValue,
} from 'utilities';

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

  const healthFactor =
    pool.userBorrowBalanceCents && pool.userBorrowLimitCents
      ? calculateHealthFactor({
          borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
          borrowLimitCents: pool.userBorrowLimitCents.toNumber(),
        })
      : 0;

  const { color } = useHealthFactor({ value: healthFactor });

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
            fillColor={color}
            strokeWidthPx={3}
            sizePx={16}
          />
        </Tooltip>
      )}
    </>
  );
};
