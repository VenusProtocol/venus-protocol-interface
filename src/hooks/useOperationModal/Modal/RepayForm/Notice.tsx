/** @jsxImportSource @emotion/react */
import { NoticeError, NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { useStyles as useSharedStyles } from '../styles';
import { FormError } from './useForm';

export interface NoticeProps {
  isRepayingFullLoan: boolean;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ isRepayingFullLoan, formError }) => {
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

  if (isRepayingFullLoan) {
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
