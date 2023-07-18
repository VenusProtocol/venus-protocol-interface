/** @jsxImportSource @emotion/react */
import { NoticeError, NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';

import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';

import { useStyles } from './styles';
import { FormError } from './types';

export interface NoticeProps {
  formErrors: FormError[];
  swap?: Swap;
}

const Notice: React.FC<NoticeProps> = ({ formErrors, swap }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (formErrors[0] === 'FROM_TOKEN_AMOUNT_HIGHER_THAN_WALLET_SPENDING_LIMIT') {
    // User is trying to swap more than their spending limit allows
    return (
      <NoticeError css={styles.notice} description={t('swap.amountAboveWalletSpendingLimit')} />
    );
  }

  if (
    !formErrors.length &&
    !!swap?.priceImpactPercentage &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
    // User is trying to swap and supply with a high price impact
    return (
      <NoticeWarning
        css={styles.notice}
        description={t('operationModal.supply.swappingWithHighPriceImpactWarning')}
      />
    );
  }

  return null;
};

export default Notice;
