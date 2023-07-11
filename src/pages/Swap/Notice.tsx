/** @jsxImportSource @emotion/react */
import { NoticeError } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { useStyles } from './styles';
import { FormError } from './types';

export interface NoticeProps {
  formErrors: FormError[];
}

const Notice: React.FC<NoticeProps> = ({ formErrors }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (formErrors[0] === 'FROM_TOKEN_AMOUNT_HIGHER_THAN_WALLET_SPENDING_LIMIT') {
    // User is trying to swap more than their spending limit allows
    return (
      <NoticeError css={styles.notice} description={t('swap.amountAboveWalletSpendingLimit')} />
    );
  }

  return null;
};

export default Notice;
