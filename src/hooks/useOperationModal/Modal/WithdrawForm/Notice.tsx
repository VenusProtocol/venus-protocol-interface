/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { NoticeError } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';
import { FormError } from './useForm';

export interface NoticeProps {
  amount: string;
  asset: Asset;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ amount, asset }) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(asset.tokenPriceCents);

  if (new BigNumber(amount).isGreaterThan(assetLiquidityTokens)) {
    // User is trying to withdraw more than available liquidities
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.aboveLiquidityWarning')}
      />
    );
  }

  return null;
};

export default Notice;
