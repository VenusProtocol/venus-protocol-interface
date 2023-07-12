/** @jsxImportSource @emotion/react */
import { NoticeError, NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Swap } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';
import { FormError } from './useForm';

export interface NoticeProps {
  asset: Asset;
  swap?: Swap;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({ asset, swap, formError }) => {
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

  if (formError === 'HIGHER_THAN_WALLET_SPENDING_LIMIT') {
    // User is trying to supply above their spending limit
    return (
      <NoticeError
        css={styles.notice}
        description={t('operationModal.supply.amountAboveWalletSpendingLimit')}
      />
    );
  }

  if (
    typeof swap?.priceImpactPercentage === 'number' &&
    swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE
  ) {
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
