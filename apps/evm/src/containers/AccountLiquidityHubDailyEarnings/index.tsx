import { LabeledInlineContent, ValueUpdate } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub } from 'types';
import { formatToReadableDailyEarnings } from './formatToReadableDailyEarnings';

export interface AccountLiquidityHubDailyEarningsProps {
  liquidityHubs: LiquidityHub[];
  simulatedLiquidityHubs?: LiquidityHub[];
}

export const AccountLiquidityHubDailyEarnings: React.FC<AccountLiquidityHubDailyEarningsProps> = ({
  liquidityHubs,
  simulatedLiquidityHubs,
}) => {
  const { t } = useTranslation();

  return (
    <LabeledInlineContent label={t('accountLiquidityHubDailyEarnings.label')}>
      <ValueUpdate
        original={formatToReadableDailyEarnings({ liquidityHubs })}
        update={
          simulatedLiquidityHubs &&
          simulatedLiquidityHubs.length > 0 &&
          formatToReadableDailyEarnings({
            liquidityHubs: simulatedLiquidityHubs,
          })
        }
      />
    </LabeledInlineContent>
  );
};
