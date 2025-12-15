import { NoticeWarning } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';

export interface NoticeProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  isRepayingFullLoan: boolean;
  priceImpactPercentage?: number;
}

export const Notice: React.FC<NoticeProps> = ({
  isSubmitting,
  isFormValid,
  isRepayingFullLoan,
  priceImpactPercentage,
}) => {
  const { t } = useTranslation();

  if (
    !isSubmitting &&
    isFormValid &&
    priceImpactPercentage !== undefined &&
    priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning description={t('operationForm.repay.swappingWithHighPriceImpactWarning')} />
    );
  }

  if (isRepayingFullLoan) {
    return <NoticeWarning description={t('operationForm.repay.fullRepaymentWarning')} />;
  }

  return null;
};
