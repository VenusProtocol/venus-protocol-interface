import BigNumber from 'bignumber.js';

import { NoticeWarning } from 'components';
import { useTranslation } from 'libs/translations';

export interface NoticeProps {
  amount: string;
  safeLimitTokens: string;
  limitTokens: string;
}

const Notice: React.FC<NoticeProps> = ({ amount, safeLimitTokens, limitTokens }) => {
  const { t } = useTranslation();

  if (
    new BigNumber(amount).isGreaterThan(0) &&
    new BigNumber(amount).isGreaterThanOrEqualTo(safeLimitTokens) &&
    new BigNumber(amount).isLessThanOrEqualTo(limitTokens)
  ) {
    // User is trying to borrow above their safe limit (allowed but puts them at
    // risk of liquidation)
    return (
      <NoticeWarning className="mt-3" description={t('operationForm.warning.aboveSafeLimit')} />
    );
  }

  return null;
};

export default Notice;
