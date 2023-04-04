/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  LabeledInlineContent,
  NoticeWarning,
  SelectTokenTextField,
  TertiaryButton,
  TokenTextField,
} from 'components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, Swap, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertWeiToTokens,
  formatToReadablePercentage,
  isFeatureEnabled,
} from 'utilities';

import { useRepay } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo, { SwapError } from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useIsMounted from 'hooks/useIsMounted';

import { useStyles as useSharedStyles } from '../styles';
import SubmitSection from './SubmitSection';
import SwapDetails from './SwapDetails';
import calculatePercentageOfUserBorrowBalance from './calculatePercentageOfUserBorrowBalance';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useForm, { ErrorCode, FormValues, UseFormProps } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormUiProps {
  asset: Asset;
  pool: Pool;
  onRepay: UseFormProps['onRepay'];
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  onFormValuesChangeCallback: (formValues: FormValues) => void;
  isSwapLoading: boolean;
  swap?: Swap;
  swapError?: SwapError;
}

export const RepayFormUi: React.FC<RepayFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onRepay,
  tokenBalances = [],
  onFormValuesChangeCallback,
  isSwapLoading,
  swap,
  swapError,
}) => {
  const isMounted = useIsMounted();
  const { t, Trans } = useTranslation();

  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  const formikProps = useForm({
    asset,
    swap,
    onCloseModal,
    onRepay,
  });

  // Detect form value changes
  useEffect(() => {
    if (isMounted()) {
      onFormValuesChangeCallback(formikProps.values);
    }
  }, [formikProps.values]);

  const userWalletBalanceTokens = useMemo(() => {
    // Get the wallet balance from the asset object if it corresponds to the
    // selected token of if the integrated swap feature is not enabled
    if (
      areTokensEqual(asset.vToken.underlyingToken, formikProps.values.fromToken) ||
      !isFeatureEnabled('integratedSwap')
    ) {
      return asset.userWalletBalanceTokens;
    }

    // Otherwise get wallet balance from the list of fetched token balances
    const tokenBalance = tokenBalances.find(item =>
      areTokensEqual(item.token, formikProps.values.fromToken),
    );

    return (
      tokenBalance &&
      convertWeiToTokens({
        valueWei: tokenBalance.balanceWei,
        token: tokenBalance.token,
      })
    );
  }, [asset.vToken.underlyingToken, asset.userWalletBalanceTokens, formikProps.values.fromToken]);

  const readableTokenBorrowBalance = useFormatTokensToReadableValue({
    value: asset.userBorrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

  const readableTokenWalletBalance = useFormatTokensToReadableValue({
    value: userWalletBalanceTokens,
    token: formikProps.values.fromToken,
  });

  const toTokenAmountTokens = useMemo(() => {
    if (swap) {
      return convertWeiToTokens({
        valueWei:
          swap.direction === 'exactAmountIn'
            ? swap.expectedToTokenAmountReceivedWei
            : swap.toTokenAmountReceivedWei,
        token: swap.toToken,
      }).toFixed();
    }

    return formikProps.values.amountTokens;
  }, [swap, formikProps.values.amountTokens]);

  const isRepayingFullLoan = formikProps.values.fixedRepayPercentage === 100;

  const handleRightMaxButtonClick = useCallback(() => {
    if (asset.userBorrowBalanceTokens.isEqualTo(0)) {
      formikProps.setFieldValue('amountTokens', '0');
      return;
    }

    // Mark user as wanting to repay full loan if they have the budget for it
    // and if they have a loan to repay
    if (
      userWalletBalanceTokens &&
      userWalletBalanceTokens.isGreaterThanOrEqualTo(asset.userBorrowBalanceTokens)
    ) {
      formikProps.setFieldValue('fixedRepayPercentage', 100);
      return;
    }

    // Otherwise update field value to correspond to user's balance
    formikProps.setValues(currentValues => ({
      ...currentValues,
      amountTokens: new BigNumber(userWalletBalanceTokens || 0).toFixed(),
      fixedRepayPercentage: undefined,
    }));
  }, [asset.userBorrowBalanceTokens, userWalletBalanceTokens]);

  return (
    <form onSubmit={formikProps.handleSubmit}>
      <LabeledInlineContent
        css={sharedStyles.getRow({ isLast: true })}
        label={t('borrowRepayModal.repay.currentlyBorrowing')}
      >
        {readableTokenBorrowBalance}
      </LabeledInlineContent>

      <div css={sharedStyles.getRow({ isLast: false })}>
        {isFeatureEnabled('integratedSwap') ? (
          <SelectTokenTextField
            selectedToken={formikProps.values.fromToken}
            value={formikProps.values.amountTokens}
            // Only display error state if amount is higher than limits
            hasError={
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_REPAY_BALANCE ||
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_WALLET_BALANCE
            }
            disabled={formikProps.isSubmitting}
            onChange={amountTokens => {
              formikProps.setValues(currentValues => ({
                ...currentValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }));
            }}
            onChangeSelectedToken={token => formikProps.setFieldValue('fromToken', token)}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            tokenBalances={tokenBalances}
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
        ) : (
          <TokenTextField
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formikProps.values.amountTokens}
            onChange={amountTokens =>
              formikProps.setValues(currentValues => ({
                ...currentValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }))
            }
            disabled={formikProps.isSubmitting}
            onBlur={formikProps.handleBlur}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            data-testid={TEST_IDS.tokenTextField}
            // Only display error state if amount is higher than limits
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

      <div css={sharedStyles.getRow({ isLast: true })}>
        <div css={styles.selectButtonsContainer}>
          {PRESET_PERCENTAGES.map(percentage => (
            <TertiaryButton
              key={`select-button-${percentage}`}
              css={styles.selectButton}
              small
              active={percentage === formikProps.values.fixedRepayPercentage}
              onClick={() => formikProps.setFieldValue('fixedRepayPercentage', percentage)}
            >
              {formatToReadablePercentage(percentage)}
            </TertiaryButton>
          ))}
        </div>

        {isRepayingFullLoan && (
          <NoticeWarning
            css={sharedStyles.notice}
            description={t('borrowRepayModal.repay.fullRepaymentWarning')}
          />
        )}

        {swap && <SwapDetails swap={swap} />}
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        amountTokens={new BigNumber(toTokenAmountTokens || 0)}
        action="repay"
      />

      <SubmitSection
        isFormDirty={formikProps.dirty}
        isFormSubmitting={formikProps.isSubmitting}
        isFormValid={formikProps.isValid}
        isSwapLoading={isSwapLoading}
        swapError={swapError}
        formErrors={formikProps.errors}
        fromToken={swap ? swap.fromToken : asset.vToken.underlyingToken}
        fromTokenAmount={formikProps.values.amountTokens}
      />
    </form>
  );
};

export interface RepayFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const RepayForm: React.FC<RepayFormProps> = ({ asset, pool, onCloseModal }) => {
  const { accountAddress } = useAuth();

  // We copy the form values from the UI component (and keep them updated via
  // callback function) as we need them to generate the swap info
  const [formValuesCopy, setFormValuesCopy] = useState<FormValues | undefined>();

  const { mutateAsync: onRepay } = useRepay({
    vToken: asset.vToken,
  });

  // TODO: handle swap and repay

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isFeatureEnabled('integratedSwap'),
    },
  );

  const swapDirection = formValuesCopy?.fixedRepayPercentage ? 'exactAmountOut' : 'exactAmountIn';

  const swapInfo = useGetSwapInfo({
    fromToken: formValuesCopy?.fromToken || asset.vToken.underlyingToken,
    fromTokenAmountTokens:
      swapDirection === 'exactAmountIn' ? formValuesCopy?.amountTokens : undefined,
    toToken: asset.vToken.underlyingToken,
    toTokenAmountTokens: formValuesCopy?.fixedRepayPercentage
      ? calculatePercentageOfUserBorrowBalance({
          asset,
          percentage: formValuesCopy?.fixedRepayPercentage,
        })
      : undefined,
    direction: swapDirection,
  });

  return (
    <RepayFormUi
      asset={asset}
      pool={pool}
      onCloseModal={onCloseModal}
      onRepay={onRepay}
      tokenBalances={tokenBalances}
      onFormValuesChangeCallback={setFormValuesCopy}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
    />
  );
};

export default RepayForm;
