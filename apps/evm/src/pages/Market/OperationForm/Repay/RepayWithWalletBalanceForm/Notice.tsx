import { NoticeWarning } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Swap } from 'types';

export interface NoticeProps {
  isRepayingFullLoan: boolean;
  swap?: Swap;
}

const Notice: React.FC<NoticeProps> = ({ isRepayingFullLoan, swap }) => {
  const { t } = useTranslation();

  if (
    !!swap?.priceImpactPercentage &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning
        className="mt-3"
        description={t('operationForm.repay.swappingWithHighPriceImpactWarning')}
      />
    );
  }

  if (isRepayingFullLoan) {
    // Supply cap has been reached so supplying more is forbidden
    return (
      <NoticeWarning className="mt-3" description={t('operationForm.repay.fullRepaymentWarning')} />
    );
  }

  return null;
};

export default Notice;
