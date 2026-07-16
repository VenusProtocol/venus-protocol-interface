import { LabeledInlineContent, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { formatToReadableDailyEarnings } from './formatToReadableDailyEarnings';

export interface AccountPoolDailyEarningsProps {
  pool: Pool;
  simulatedPool?: Pool;
}

export const AccountPoolDailyEarnings: React.FC<AccountPoolDailyEarningsProps> = ({
  pool,
  simulatedPool,
}) => {
  const { t } = useTranslation();

  return (
    <LabeledInlineContent label={t('accountPoolDailyEarnings.label')}>
      <ValueUpdate
        original={formatToReadableDailyEarnings({
          yearlyEarningsCents: pool.userYearlyEarningsCents,
        })}
        update={
          simulatedPool?.userYearlyEarningsCents &&
          formatToReadableDailyEarnings({
            yearlyEarningsCents: simulatedPool.userYearlyEarningsCents,
          })
        }
      />
    </LabeledInlineContent>
  );
};
