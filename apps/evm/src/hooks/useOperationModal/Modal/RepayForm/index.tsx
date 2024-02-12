/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { useRepay, useSwapTokensAndRepay } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  QuaternaryButton,
  SelectTokenTextField,
  SpendingLimit,
  SwapDetails,
  TokenTextField,
} from 'components';
import { AccountData } from 'containers/AccountData';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetSwapRouterContractAddress } from 'packages/contracts';
import { VError } from 'packages/errors';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
} from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection, { SubmitSectionProps } from './SubmitSection';
import calculatePercentageOfUserBorrowBalance from './calculatePercentageOfUserBorrowBalance';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  asset: Asset;
  pool: Pool;
  isIntegratedSwapEnabled: boolean;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const RepayFormUi: React.FC<RepayFormUiProps> = ({
  asset,
  pool,
  isIntegratedSwapEnabled,
  onCloseModal,
  onSubmit,
  isSubmitting,
  tokenBalances = [],
  setFormValues,
  formValues,
  isSwapLoading,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApproved,
  isFromTokenWalletSpendingLimitLoading,
  fromTokenWalletSpendingLimitTokens,
  revokeFromTokenWalletSpendingLimit,
  isRevokeFromTokenWalletSpendingLimitLoading,
  swap,
  swapError,
}) => {
  const { t } = useTranslation();

  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [isIntegratedSwapEnabled, formValues.fromToken, asset.vToken.underlyingToken],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertMantissaToTokens({
          value: tokenBalance.balanceMantissa,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [asset.userWalletBalanceTokens, formValues.fromToken, tokenBalances, isUsingSwap]);

  const { handleSubmit, isFormValid, formError } = useForm({
    toVToken: asset.vToken,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens: asset.userBorrowBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
    isFromTokenApproved,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
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
  }, [asset.userBorrowBalanceTokens, fromTokenUserWalletBalanceTokens, setFormValues]);

  return (
    <form onSubmit={handleSubmit}>
      <LabeledInlineContent
        css={sharedStyles.getRow({ isLast: true })}
        label={t('operationModal.repay.currentlyBorrowing')}
      >
        {readableUserBorrowBalanceTokens}
      </LabeledInlineContent>

      <div css={sharedStyles.getRow({ isLast: false })}>
        {isIntegratedSwapEnabled ? (
          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            selectedToken={formValues.fromToken}
            value={formValues.amountTokens}
            hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
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
              label: t('operationModal.repay.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            tokenBalances={tokenBalances}
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
              label: t('operationModal.repay.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            data-testid={TEST_IDS.tokenTextField}
            hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
          />
        )}
      </div>

      <div css={sharedStyles.getRow({ isLast: true })}>
        <div css={styles.selectButtonsContainer}>
          {PRESET_PERCENTAGES.map(percentage => (
            <QuaternaryButton
              key={`select-button-${percentage}`}
              css={styles.selectButton}
              active={percentage === formValues.fixedRepayPercentage}
              disabled={asset.userBorrowBalanceTokens.isEqualTo(0)}
              onClick={() =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  fixedRepayPercentage: percentage,
                }))
              }
            >
              {formatPercentageToReadableValue(percentage)}
            </QuaternaryButton>
          ))}
        </div>

        {!isSubmitting && !isSwapLoading && (
          <Notice isRepayingFullLoan={isRepayingFullLoan} formError={formError} swap={swap} />
        )}
      </div>

      <div css={sharedStyles.getRow({ isLast: true })}>
        <LabeledInlineContent
          label={t('operationModal.repay.walletBalance')}
          css={sharedStyles.getRow({ isLast: false })}
        >
          {readableFromTokenUserWalletBalanceTokens}
        </LabeledInlineContent>

        <SpendingLimit
          token={formValues.fromToken}
          walletBalanceTokens={fromTokenUserWalletBalanceTokens}
          walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
          onRevoke={revokeFromTokenWalletSpendingLimit}
          isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
          data-testid={TEST_IDS.spendingLimit}
        />
      </div>

      {isUsingSwap && (
        <SwapDetails
          action="repay"
          swap={swap}
          data-testid={TEST_IDS.swapDetails}
          css={sharedStyles.getRow({ isLast: true })}
        />
      )}

      <Delimiter css={sharedStyles.getRow({ isLast: true })} />

      <AccountData
        asset={asset}
        pool={pool}
        swap={swap}
        amountTokens={new BigNumber(formValues.amountTokens || 0)}
        action="repay"
        isUsingSwap={isUsingSwap}
        className="mb-6"
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
        approveFromToken={approveFromToken}
        isApproveFromTokenLoading={isApproveFromTokenLoading}
        isFromTokenApproved={isFromTokenApproved}
        isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
        isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
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
  const { accountAddress } = useAccountAddress();
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
    fixedRepayPercentage: undefined,
  });

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const spenderAddress = areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken)
    ? asset.vToken.address
    : swapRouterContractAddress;

  const {
    isTokenApproved: isFromTokenApproved,
    approveToken: approveFromToken,
    isApproveTokenLoading: isApproveFromTokenLoading,
    isWalletSpendingLimitLoading: isFromTokenWalletSpendingLimitLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  const { mutateAsync: onRepay, isLoading: isRepayLoading } = useRepay({
    vToken: asset.vToken,
    poolName: pool.name,
  });

  const { mutateAsync: onSwapAndRepay, isLoading: isSwapAndRepayLoading } = useSwapTokensAndRepay({
    poolName: pool.name,
    poolComptrollerAddress: pool.comptrollerAddress,
    vToken: asset.vToken,
  });

  const isSubmitting = isRepayLoading || isSwapAndRepayLoading;

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isIntegratedSwapEnabled,
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
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      return onRepay({
        isRepayingFullLoan,
        amountMantissa,
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
      isIntegratedSwapEnabled={isIntegratedSwapEnabled}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      tokenBalances={tokenBalances}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
      isFromTokenApproved={isFromTokenApproved}
      approveFromToken={approveFromToken}
      isApproveFromTokenLoading={isApproveFromTokenLoading}
      isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
      fromTokenWalletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
      revokeFromTokenWalletSpendingLimit={revokeFromTokenWalletSpendingLimit}
      isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
    />
  );
};

export default RepayForm;
