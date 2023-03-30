/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  LabeledInlineContent,
  NoticeWarning,
  PrimaryButton,
  TertiaryButton,
  TokenTextField,
} from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { formatToReadablePercentage, formatTokensToReadableValue } from 'utilities';

import { useRepay } from 'clients/api';
import { ErrorCode } from 'containers/AmountForm';

import { useStyles as useSharedStyles } from '../../styles';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useForm, { UseFormProps } from './useForm';

// TODO: add stories

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormUiProps {
  asset: Asset;
  pool: Pool;
  onRepay: UseFormProps['onRepay'];
  onCloseModal: () => void;
}

export const RepayFormUi: React.FC<RepayFormUiProps> = ({ asset, pool, onCloseModal, onRepay }) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  const { formikProps, limitTokens } = useForm({
    asset,
    onCloseModal,
    onRepay,
  });

  const getTokenBorrowBalancePercentageTokens = React.useCallback(
    (percentage: number) =>
      asset.userBorrowBalanceTokens
        .multipliedBy(percentage / 100)
        .decimalPlaces(asset.vToken.underlyingToken.decimals)
        .toFixed(),
    [asset.userBorrowBalanceTokens, asset.vToken.underlyingToken.decimals],
  );

  // TODO: create useFormatTokensToReadableValue hook
  const readableTokenBorrowBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.userBorrowBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    [asset.userBorrowBalanceTokens, asset.vToken.underlyingToken],
  );

  // TODO: create useFormatTokensToReadableValue hook
  const readableTokenWalletBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.userWalletBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    [asset.userWalletBalanceTokens, asset.vToken.underlyingToken],
  );

  const shouldDisplayFullRepaymentWarning = React.useCallback(
    (repayAmountTokens: string) =>
      repayAmountTokens !== '0' && asset.userBorrowBalanceTokens.eq(repayAmountTokens),
    [asset.vToken.underlyingToken, asset.userBorrowBalanceTokens],
  );

  return (
    <form onSubmit={formikProps.handleSubmit}>
      <LabeledInlineContent
        css={sharedStyles.getRow({ isLast: true })}
        label={t('borrowRepayModal.repay.currentlyBorrowing')}
      >
        {readableTokenBorrowBalance}
      </LabeledInlineContent>

      <div css={[sharedStyles.getRow({ isLast: false })]}>
        <TokenTextField
          name="amount"
          token={asset.vToken.underlyingToken}
          value={formikProps.values.amount}
          onChange={amount => formikProps.setFieldValue('amount', amount, true)}
          disabled={formikProps.isSubmitting}
          onBlur={formikProps.handleBlur}
          rightMaxButton={{
            label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
            valueOnClick: limitTokens,
          }}
          data-testid={TEST_IDS.tokenTextField}
          // Only display error state if amount is higher than limit
          hasError={formikProps.errors.amount === ErrorCode.HIGHER_THAN_MAX}
          description={
            <Trans
              i18nKey="borrowRepayModal.repay.walletBalance"
              components={{
                White: <span css={sharedStyles.whiteLabel} />,
              }}
              values={{ balance: readableTokenWalletBalance }}
            />
          }
        />
      </div>

      <div css={[sharedStyles.getRow({ isLast: true })]}>
        <div css={styles.selectButtonsContainer}>
          {PRESET_PERCENTAGES.map(percentage => (
            <TertiaryButton
              key={`select-button-${percentage}`}
              css={styles.selectButton}
              onClick={() =>
                formikProps.setFieldValue(
                  'amount',
                  getTokenBorrowBalancePercentageTokens(percentage),
                  true,
                )
              }
            >
              {formatToReadablePercentage(percentage)}
            </TertiaryButton>
          ))}
        </div>

        {shouldDisplayFullRepaymentWarning(formikProps.values.amount) && (
          <NoticeWarning
            css={sharedStyles.notice}
            description={t('borrowRepayModal.repay.fullRepaymentWarning')}
          />
        )}
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        amountTokens={new BigNumber(formikProps.values.amount || 0)}
        action="repay"
      />

      <PrimaryButton
        type="submit"
        loading={formikProps.isSubmitting}
        disabled={!formikProps.isValid || !formikProps.dirty || formikProps.isSubmitting}
        fullWidth
      >
        {formikProps.dirty && formikProps.isValid
          ? t('borrowRepayModal.repay.submitButton')
          : t('borrowRepayModal.repay.submitButtonDisabled')}
      </PrimaryButton>
    </form>
  );
};

export interface RepayFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const RepayForm: React.FC<RepayFormProps> = ({ asset, pool, onCloseModal }) => {
  const { mutateAsync: onRepay } = useRepay({
    vToken: asset.vToken,
  });

  return <RepayFormUi asset={asset} pool={pool} onCloseModal={onCloseModal} onRepay={onRepay} />;
};

export default RepayForm;
