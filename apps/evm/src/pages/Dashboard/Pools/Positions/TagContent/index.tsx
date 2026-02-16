import { ProgressCircle, Tooltip } from 'components';
import type { Pool } from 'types';

import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import { calculatePercentage, formatPercentageToReadableValue } from 'utilities';

export interface TagContentProps {
  pool: Pool;
}

export const TagContent: React.FC<TagContentProps> = ({ pool }) => {
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

  const healthFactor = pool.userHealthFactor ?? 0;

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
