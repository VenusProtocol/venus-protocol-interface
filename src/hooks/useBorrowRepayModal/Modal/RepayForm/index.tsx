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
import { VError } from 'errors';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertTokensToWei,
  convertWeiToTokens,
  formatToReadablePercentage,
  isFeatureEnabled,
} from 'utilities';

import { useRepay, useSwapTokensAndRepay } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';

import { useStyles as useSharedStyles } from '../styles';
import SubmitSection from './SubmitSection';
import SwapDetails from './SwapDetails';
import calculatePercentageOfUserBorrowBalance from './calculatePercentageOfUserBorrowBalance';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormUiProps {
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  swap?: Swap;
  swapError?: SwapError;
}

export const RepayFormUi: React.FC<RepayFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  tokenBalances = [],
  setFormValues,
  formValues,
  isSwapLoading,
  swap,
  swapError,
}) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (
      isFeatureEnabled('integratedSwap') &&
      formValues.fromToken &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken)
    ) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertWeiToTokens({
          valueWei: tokenBalance.balanceWei,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [
    asset.vToken.underlyingToken,
    asset.userWalletBalanceTokens,
    formValues.fromToken,
    tokenBalances,
  ]);

  const { handleSubmit, isFormValid, formError } = useForm({
    toVToken: asset.vToken,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens: asset.userBorrowBalanceTokens,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readablefromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const readableUserBorrowBalanceTokens = useFormatTokensToReadableValue({
    value: asset.userBorrowBalanceTokens,
    token: asset.vToken.underlyingToken,
  });

  const isRepayingFullLoan = useMemo(
    () => formValues.fixedRepayPercentage === 100,
    [formValues.fixedRepayPercentage],
  );

  const handleRightMaxButtonClick = useCallback(() => {
    if (asset.userBorrowBalanceTokens.isEqualTo(0)) {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        amountTokens: '0',
      }));
      return;
    }

    // Update field value to correspond to user's balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed(),
      fixedRepayPercentage: undefined,
    }));
  }, [asset.userBorrowBalanceTokens, fromTokenUserWalletBalanceTokens]);

  return (
    <form onSubmit={handleSubmit}>
      <LabeledInlineContent
        css={sharedStyles.getRow({ isLast: true })}
        label={t('borrowRepayModal.repay.currentlyBorrowing')}
      >
        {readableUserBorrowBalanceTokens}
      </LabeledInlineContent>

      <div css={sharedStyles.getRow({ isLast: false })}>
        {isFeatureEnabled('integratedSwap') ? (
          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            selectedToken={formValues.fromToken}
            value={formValues.amountTokens}
            hasError={!!formError && Number(formValues.amountTokens) > 0}
            disabled={isSubmitting}
            onChange={amountTokens =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }))
            }
            onChangeSelectedToken={fromToken =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                fromToken,
              }))
            }
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
                values={{ balance: readablefromTokenUserWalletBalanceTokens }}
              />
            }
          />
        ) : (
          <TokenTextField
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formValues.amountTokens}
            onChange={amountTokens =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }))
            }
            disabled={isSubmitting}
            rightMaxButton={{
              label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            data-testid={TEST_IDS.tokenTextField}
            hasError={!!formError && Number(formValues.amountTokens) > 0}
            description={
              <Trans
                i18nKey="borrowRepayModal.repay.walletBalance"
                components={{
                  White: <span css={sharedStyles.whiteLabel} />,
                }}
                values={{ balance: readablefromTokenUserWalletBalanceTokens }}
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
              active={percentage === formValues.fixedRepayPercentage}
              onClick={() =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  fixedRepayPercentage: percentage,
                }))
              }
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

        {swap && <SwapDetails swap={swap} data-testid={TEST_IDS.swapDetails} />}
      </div>

      <AccountData
        asset={asset}
        pool={pool}
        swap={swap}
        amountTokens={new BigNumber(formValues.amountTokens || 0)}
        action="repay"
      />

      <SubmitSection
        isFormSubmitting={isSubmitting}
        isFormValid={isFormValid}
        swap={swap}
        isSwapLoading={isSwapLoading}
        formError={formError}
        toToken={asset.vToken.underlyingToken}
        fromToken={formValues.fromToken}
        fromTokenAmountTokens={formValues.amountTokens}
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

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
    fixedRepayPercentage: undefined,
  });

  const { mutateAsync: onRepay, isLoading: isRepayLoading } = useRepay({
    vToken: asset.vToken,
  });

  const { mutateAsync: onSwapAndRepay, isLoading: isSwapAndRepayLoading } = useSwapTokensAndRepay({
    vToken: asset.vToken,
  });

  const isSubmitting = isRepayLoading || isSwapAndRepayLoading;

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isFeatureEnabled('integratedSwap'),
    },
  );

  const onSubmit: RepayFormUiProps['onSubmit'] = async ({
    toVToken,
    fromToken,
    fromTokenAmountTokens,
    swap,
    fixedRepayPercentage,
  }) => {
    const isSwapping = !areTokensEqual(fromToken, toVToken.underlyingToken);
    const isRepayingFullLoan = fixedRepayPercentage === 100;

    // Handle repay flow
    if (!isSwapping) {
      const amountWei = convertTokensToWei({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      return onRepay({
        isRepayingFullLoan,
        amountWei,
      });
    }

    // Throw an error if we're meant to execute a swap but no swap was
    // passed through props. This should never happen since the form is
    // disabled while swap infos are being fetched, but we add this logic
    // as a safeguard
    if (!swap) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    // Handle swap and repay flow
    return onSwapAndRepay({
      isRepayingFullLoan,
      swap,
    });
  };

  const swapDirection = formValues.fixedRepayPercentage ? 'exactAmountOut' : 'exactAmountIn';

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken || asset.vToken.underlyingToken,
    fromTokenAmountTokens: swapDirection === 'exactAmountIn' ? formValues.amountTokens : undefined,
    toToken: asset.vToken.underlyingToken,
    toTokenAmountTokens: formValues.fixedRepayPercentage
      ? calculatePercentageOfUserBorrowBalance({
          token: asset.vToken.underlyingToken,
          userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
          percentage: formValues.fixedRepayPercentage,
        })
      : undefined,
    direction: swapDirection,
  });

  return (
    <RepayFormUi
      asset={asset}
      pool={pool}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      tokenBalances={tokenBalances}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
    />
  );
};

export default RepayForm;
