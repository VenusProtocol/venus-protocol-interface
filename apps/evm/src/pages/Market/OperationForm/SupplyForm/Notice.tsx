import { NoticeWarning } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { SwapQuote } from 'types';

export interface NoticeProps {
  swap?: SwapQuote;
}

const Notice: React.FC<NoticeProps> = ({ swap }) => {
  const { t } = useTranslation();

  if (
    !!swap?.priceImpactPercentage &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning
        className="mt-3"
        description={t('operationForm.warning.swappingWithHighPriceImpactWarning')}
      />
    );
  }

  return null;
};

export default Notice;
