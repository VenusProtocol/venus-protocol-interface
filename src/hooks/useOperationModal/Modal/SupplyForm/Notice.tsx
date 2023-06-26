/** @jsxImportSource @emotion/react */
import { NoticeError } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';
import { FormError } from './useForm';

export interface NoticeProps {
  asset: Asset;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ asset, formError }) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  if (formError === 'SUPPLY_CAP_ALREADY_REACHED') {
    // Supply cap has been reached so supplying more is forbidden
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.noticeError}
        description={t('operationModal.supply.supplyCapReachedWarning', {
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  if (formError === 'HIGHER_THAN_SUPPLY_CAP' && asset.supplyCapTokens) {
    // User is trying to supply above supply cap
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.noticeError}
        description={t('operationModal.supply.amountAboveSupplyCapWarning', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: asset.supplyCapTokens.minus(asset.supplyBalanceTokens),
            token: asset.vToken.underlyingToken,
          }),
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
          assetSupplyBalance: formatTokensToReadableValue({
            value: asset.supplyBalanceTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  return null;
};

export default Notice;
