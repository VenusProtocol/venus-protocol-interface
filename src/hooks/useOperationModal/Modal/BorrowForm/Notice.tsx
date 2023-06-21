/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { NoticeError, NoticeWarning } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';
import { FormError } from './useForm';

export interface NoticeProps {
  hasUserCollateralizedSuppliedAssets: boolean;
  amount: string;
  safeLimitTokens: string;
  limitTokens: string;
  asset: Asset;
  formError?: FormError;
}

const Notice: React.FC<NoticeProps> = ({
  hasUserCollateralizedSuppliedAssets,
  amount,
  asset,
  safeLimitTokens,
  formError,
  limitTokens,
}) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  if (asset.borrowCapTokens && formError === 'BORROW_CAP_ALREADY_REACHED') {
    // Borrow cap has been reached so borrowing more is forbidden
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.borrowCapReachedWarning', {
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  if (!hasUserCollateralizedSuppliedAssets) {
    // User has not supplied any collateral yet
    return (
      <NoticeWarning
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.noCollateralizedSuppliedAssetWarning', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        })}
      />
    );
  }

  if (asset.borrowCapTokens && formError === 'HIGHER_THAN_BORROW_CAP') {
    // User is trying to borrow above borrow cap
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.aboveBorrowCapWarning', {
          userMaxBorrowAmount: formatTokensToReadableValue({
            value: asset.borrowCapTokens.minus(asset.borrowBalanceTokens),
            token: asset.vToken.underlyingToken,
          }),
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
          }),
          assetBorrowBalance: formatTokensToReadableValue({
            value: asset.borrowBalanceTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(asset.tokenPriceCents);

  if (new BigNumber(amount).isGreaterThan(assetLiquidityTokens)) {
    // User is trying to borrow more than available liquidities
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.aboveLiquidityWarning')}
      />
    );
  }

  if (
    new BigNumber(amount).isGreaterThan(0) &&
    new BigNumber(amount).isGreaterThanOrEqualTo(safeLimitTokens) &&
    new BigNumber(amount).isLessThanOrEqualTo(limitTokens)
  ) {
    // User is trying to borrow above their safe limit (allowed but puts them at
    // risk of liquidation)
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.notice}
        description={t('operationModal.borrow.aboveSafeLimitWarning')}
      />
    );
  }

  return null;
};

export default Notice;
