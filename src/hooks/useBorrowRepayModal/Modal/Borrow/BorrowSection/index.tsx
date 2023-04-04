/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  FormikSubmitButton,
  FormikTokenTextField,
  IsolatedAssetWarning,
} from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';

import { ErrorCode } from 'containers/AmountForm';

import { useStyles } from '../../styles';
import Notice from '../Notice';
import TEST_IDS from '../testIds';

interface SubmitSectionProps {
  asset: Asset;
  pool: Pool;
  safeBorrowLimitPercentage: number;
  safeLimitTokens: string;
  readableTokenBorrowableAmount: string;
  isBorrowLoading: boolean;
  hasUserCollateralizedSuppliedAssets: boolean;
  hasBorrowCapBeenReached: boolean;
  limitTokens: string;
  values: { amount: string };
  dirty: boolean;
  isValid: boolean;
  errors: { amount?: string };
}

const BorrowSection: React.FC<SubmitSectionProps> = ({
  asset,
  pool,
  safeBorrowLimitPercentage,
  readableTokenBorrowableAmount,
  isBorrowLoading,
  hasUserCollateralizedSuppliedAssets,
  hasBorrowCapBeenReached,
  safeLimitTokens,
  limitTokens,
  values,
  dirty,
  isValid,
  errors,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useStyles();

  const isHighRiskBorrow =
    new BigNumber(values.amount).isGreaterThanOrEqualTo(safeLimitTokens) &&
    new BigNumber(values.amount).isLessThanOrEqualTo(limitTokens);

  const enabledLabel = isHighRiskBorrow
    ? t('borrowRepayModal.borrow.submitButtonHighRisk')
    : t('borrowRepayModal.borrow.submitButton');

  return (
    <>
      {pool.isIsolated && (
        <IsolatedAssetWarning
          pool={pool}
          token={asset.vToken.underlyingToken}
          type="borrow"
          css={sharedStyles.isolatedAssetWarning}
        />
      )}

      <div css={[sharedStyles.getRow({ isLast: true })]}>
        <FormikTokenTextField
          name="amount"
          token={asset.vToken.underlyingToken}
          disabled={
            isBorrowLoading || !hasUserCollateralizedSuppliedAssets || hasBorrowCapBeenReached
          }
          rightMaxButton={{
            label: t('borrowRepayModal.borrow.rightMaxButtonLabel', {
              limitPercentage: safeBorrowLimitPercentage,
            }),
            valueOnClick: safeLimitTokens,
          }}
          data-testid={TEST_IDS.tokenTextField}
          // Only display error state if amount is higher than borrow limit
          hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
          description={
            <Trans
              i18nKey="borrowRepayModal.borrow.borrowableAmount"
              components={{
                White: <span css={sharedStyles.whiteLabel} />,
              }}
              values={{ amount: readableTokenBorrowableAmount }}
            />
          }
        />

        <Notice
          hasUserCollateralizedSuppliedAssets={hasUserCollateralizedSuppliedAssets}
          amount={values.amount}
          safeLimitTokens={safeLimitTokens}
          limitTokens={limitTokens}
          asset={asset}
        />
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        amountTokens={new BigNumber(values.amount || 0)}
        action="borrow"
      />

      <FormikSubmitButton
        css={sharedStyles.submitButtonHighRisk({ isHighRiskBorrow })}
        loading={isBorrowLoading}
        disabled={
          !isValid ||
          !dirty ||
          isBorrowLoading ||
          !hasUserCollateralizedSuppliedAssets ||
          hasBorrowCapBeenReached
        }
        fullWidth
        enabledLabel={enabledLabel}
        disabledLabel={t('borrowRepayModal.borrow.submitButtonDisabled')}
        data-testid={TEST_IDS.submitButton}
      />
    </>
  );
};

export default BorrowSection;
