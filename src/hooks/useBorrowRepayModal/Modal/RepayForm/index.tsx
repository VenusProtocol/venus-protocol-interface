/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  LabeledInlineContent,
  NoticeWarning,
  PrimaryButton,
  SelectTokenTextField,
  TertiaryButton,
  TokenTextField,
} from 'components';
import config from 'config';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { formatToReadablePercentage } from 'utilities';

import { useRepay } from 'clients/api';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';

import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useForm, { ErrorCode, UseFormProps } from './useForm';

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

  const maxButtonValueOnClick = useMemo(
    () =>
      asset
        ? BigNumber.min(asset.userBorrowBalanceTokens, asset.userWalletBalanceTokens).toString()
        : '0',
    [asset?.userBorrowBalanceTokens, asset?.userWalletBalanceTokens],
  );

  const { formikProps } = useForm({
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

  const readableTokenBorrowBalance = useFormatTokensToReadableValue({
    value: asset.userBorrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

  const readableTokenWalletBalance = useFormatTokensToReadableValue({
    value: asset.userWalletBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

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
        {config.featureFlags.isolatedPools ? (
          <SelectTokenTextField
            selectedToken={formikProps.values.fromToken}
            value={formikProps.values.amountTokens}
            // Only display error state if amount is higher than limit
            hasError={
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_REPAY_BALANCE ||
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_WALLET_BALANCE
            }
            disabled={formikProps.isSubmitting}
            onChange={amountTokens => formikProps.setFieldValue('amountTokens', amountTokens)}
            onChangeSelectedToken={token => formikProps.setFieldValue('fromToken', token)}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              valueOnClick: maxButtonValueOnClick,
            }}
            tokenBalances={[]} // TODO: fetch token balances
          />
        ) : (
          <TokenTextField
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formikProps.values.amountTokens}
            onChange={amountTokens => formikProps.setFieldValue('amountTokens', amountTokens)}
            disabled={formikProps.isSubmitting}
            onBlur={formikProps.handleBlur}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              valueOnClick: maxButtonValueOnClick,
            }}
            data-testid={TEST_IDS.tokenTextField}
            // Only display error state if amount is higher than limit
            hasError={
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_REPAY_BALANCE ||
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_WALLET_BALANCE
            }
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
        )}
      </div>

      <div css={[sharedStyles.getRow({ isLast: true })]}>
        <div css={styles.selectButtonsContainer}>
          {PRESET_PERCENTAGES.map(percentage => (
            <TertiaryButton
              key={`select-button-${percentage}`}
              css={styles.selectButton}
              onClick={() =>
                formikProps.setFieldValue(
                  'amountTokens',
                  getTokenBorrowBalancePercentageTokens(percentage),
                  true,
                )
              }
            >
              {formatToReadablePercentage(percentage)}
            </TertiaryButton>
          ))}
        </div>

        {shouldDisplayFullRepaymentWarning(formikProps.values.amountTokens) && (
          <NoticeWarning
            css={sharedStyles.notice}
            description={t('borrowRepayModal.repay.fullRepaymentWarning')}
          />
        )}
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        amountTokens={new BigNumber(formikProps.values.amountTokens || 0)}
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
