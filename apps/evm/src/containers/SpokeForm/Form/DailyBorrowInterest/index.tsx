import { LabeledInlineContent, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { calculateDailyBorrowInterestCents, formatCentsToReadableValue } from 'utilities';

export interface DailyBorrowInterestProps {
  spokePool: Pool;
  simulatedPool?: Pool;
}

export const DailyBorrowInterest: React.FC<DailyBorrowInterestProps> = ({
  spokePool,
  simulatedPool,
}) => {
  const { t } = useTranslation();

  const readableValue = (pool: Pool) =>
    formatCentsToReadableValue({
      value: calculateDailyBorrowInterestCents({ assets: pool.assets }),
    });

  return (
    <LabeledInlineContent label={t('spokeForm.dailyBorrowInterest')}>
      <ValueUpdate
        original={readableValue(spokePool)}
        update={simulatedPool ? readableValue(simulatedPool) : undefined}
      />
    </LabeledInlineContent>
  );
};
