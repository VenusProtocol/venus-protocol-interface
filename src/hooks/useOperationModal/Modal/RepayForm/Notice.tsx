/** @jsxImportSource @emotion/react */
import { NoticeError, NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';

import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';

import { useStyles as useSharedStyles } from '../styles';
import { FormError } from './useForm';

export interface NoticeProps {
  isRepayingFullLoan: boolean;
  swap?: Swap;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ isRepayingFullLoan, swap, formError }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

  if (formError === 'HIGHER_THAN_WALLET_SPENDING_LIMIT') {
    // User is trying to supply above their spending limit
    return (
      <NoticeError
        css={sharedStyles.notice}
        description={t('operationModal.repay.amountAboveWalletSpendingLimit')}
      />
    );
  }

  if (
    !formError &&
    typeof swap?.priceImpactPercentage === 'number' &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning
        css={sharedStyles.notice}
        description={t('operationModal.repay.swappingWithHighPriceImpactWarning')}
      />
    );
  }

  if (!formError && isRepayingFullLoan) {
    // Supply cap has been reached so supplying more is forbidden
    return (
      <NoticeWarning
        css={sharedStyles.notice}
        description={t('operationModal.repay.fullRepaymentWarning')}
      />
    );
  }

  return null;
};

export default Notice;
