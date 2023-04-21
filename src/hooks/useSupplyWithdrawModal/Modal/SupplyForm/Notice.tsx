/** @jsxImportSource @emotion/react */
import { NoticeError } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import TEST_IDS from './testIds';

export interface NoticeProps {
  amount: string;
  asset: Asset;
}

const Notice: React.FC<NoticeProps> = ({ amount, asset }) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  if (
    asset.supplyCapTokens &&
    asset.supplyBalanceTokens.isGreaterThanOrEqualTo(asset.supplyCapTokens)
  ) {
    // Supply cap has been reached so supplying more is forbidden
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.noticeError}
        description={t('supplyWithdrawModal.supply.supplyCapReachedWarning', {
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        })}
      />
    );
  }

  if (
    asset.supplyCapTokens &&
    asset.supplyBalanceTokens.plus(amount).isGreaterThan(asset.supplyCapTokens)
  ) {
    // User is trying to supply above supply cap
    return (
      <NoticeError
        css={styles.notice}
        data-testid={TEST_IDS.noticeError}
        description={t('supplyWithdrawModal.supply.amountAboveSupplyCapWarning', {
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
