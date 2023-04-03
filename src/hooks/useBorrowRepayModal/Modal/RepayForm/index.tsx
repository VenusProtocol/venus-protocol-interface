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
import config from 'config';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, Swap, TokenBalance } from 'types';
import { areTokensEqual, convertWeiToTokens, formatToReadablePercentage } from 'utilities';

import { useRepay } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo, { SwapError } from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useIsMounted from 'hooks/useIsMounted';

import { useStyles as useSharedStyles } from '../styles';
import SubmitSection from './SubmitSection';
import SwapDetails from './SwapDetails';
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
      !config.featureFlags.integratedSwap
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

  const maxButtonValueOnClick = useMemo(
    () =>
      asset
        ? BigNumber.min(
            asset.userBorrowBalanceTokens,
            new BigNumber(userWalletBalanceTokens || 0),
          ).toString()
        : '0',
    [asset.userBorrowBalanceTokens, userWalletBalanceTokens],
  );

  const getTokenBorrowBalancePercentageTokens = React.useCallback(
    (percentage: number) =>
      asset.userBorrowBalanceTokens
        .multipliedBy(percentage / 100)
        .decimalPlaces(asset.vToken.underlyingToken.decimals)
        .toFixed(),
    [asset.userBorrowBalanceTokens, asset.vToken.underlyingToken.decimals, swap?.exchangeRate],
  );

  const readableTokenBorrowBalance = useFormatTokensToReadableValue({
    value: asset.userBorrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

  const readableTokenWalletBalance = useFormatTokensToReadableValue({
    value: userWalletBalanceTokens,
    token: formikProps.values.fromToken,
  });

  const isRepayingFullLoan = useMemo(
    () =>
      formikProps.values.amountTokens !== '0' &&
      asset.userBorrowBalanceTokens.eq(formikProps.values.amountTokens),
    [formikProps.values.amountTokens, asset.vToken.underlyingToken, asset.userBorrowBalanceTokens],
  );

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

  return (
    <form onSubmit={formikProps.handleSubmit}>
      <LabeledInlineContent
        css={sharedStyles.getRow({ isLast: true })}
        label={t('borrowRepayModal.repay.currentlyBorrowing')}
      >
        {readableTokenBorrowBalance}
      </LabeledInlineContent>

      <div css={sharedStyles.getRow({ isLast: false })}>
        {config.featureFlags.isolatedPools ? (
          <SelectTokenTextField
            selectedToken={formikProps.values.fromToken}
            value={formikProps.values.amountTokens}
            // Only display error state if amount is higher than limits
            hasError={
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_REPAY_BALANCE ||
              formikProps.errors.amountTokens === ErrorCode.HIGHER_THAN_WALLET_BALANCE
            }
            disabled={formikProps.isSubmitting || isSwapLoading}
            onChange={amountTokens => formikProps.setFieldValue('amountTokens', amountTokens)}
            onChangeSelectedToken={token => formikProps.setFieldValue('fromToken', token)}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              valueOnClick: maxButtonValueOnClick,
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
            onChange={amountTokens => formikProps.setFieldValue('amountTokens', amountTokens)}
            disabled={formikProps.isSubmitting}
            onBlur={formikProps.handleBlur}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              valueOnClick: maxButtonValueOnClick,
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
          {/* TODO: update to support swap and repay flow  */}
          {PRESET_PERCENTAGES.map(percentage => (
            <TertiaryButton
              key={`select-button-${percentage}`}
              css={styles.selectButton}
              small
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

        {swap && <SwapDetails swap={swap} />}

        {isRepayingFullLoan && (
          <NoticeWarning
            css={styles.notice}
            description={t('borrowRepayModal.repay.fullRepaymentWarning')}
          />
        )}
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

  // We duplicate the form values here because we need them to fetch the swap
  // info
  const [formValues, setFormValues] = useState<FormValues | undefined>();

  const { mutateAsync: onRepay } = useRepay({
    vToken: asset.vToken,
  });

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: config.featureFlags.integratedSwap,
    },
  );

  const swapInfo = useGetSwapInfo({
    fromToken: formValues?.fromToken || asset.vToken.underlyingToken,
    fromTokenAmountTokens: formValues?.amountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn', // TODO: update to exactAmountOut if user is repaying a full loan
  });

  return (
    <RepayFormUi
      asset={asset}
      pool={pool}
      onCloseModal={onCloseModal}
      onRepay={onRepay}
      tokenBalances={tokenBalances}
      onFormValuesChangeCallback={setFormValues}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
    />
  );
};

export default RepayForm;
