import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { type GetBalanceOfOutput, useRepay, useSwapTokensAndRepay } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  QuaternaryButton,
  SelectTokenTextField,
  SpendingLimit,
  TokenTextField,
} from 'components';
import { AccountData } from 'containers/AccountData';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import {
  useGetNativeTokenGatewayContractAddress,
  useGetSwapRouterContractAddress,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  getUniqueTokenBalances,
} from 'utilities';
import { SwapDetails } from '../SwapDetails';

import Notice from './Notice';
import SubmitSection, { type SubmitSectionProps } from './SubmitSection';
import calculatePercentageOfUserBorrowBalance from './calculatePercentageOfUserBorrowBalance';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

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
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  nativeWrappedTokenBalances: TokenBalance[];
  integratedSwapTokenBalances: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
  isWrappingNativeToken: boolean;
  isUsingSwap: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  onCloseModal?: () => void;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const RepayFormUi: React.FC<RepayFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  nativeWrappedTokenBalances,
  integratedSwapTokenBalances,
  setFormValues,
  formValues,
  isSwapLoading,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApproved,
  isFromTokenWalletSpendingLimitLoading,
  isIntegratedSwapFeatureEnabled,
  canWrapNativeToken,
  isWrappingNativeToken,
  isUsingSwap,
  fromTokenWalletSpendingLimitTokens,
  revokeFromTokenWalletSpendingLimit,
  isRevokeFromTokenWalletSpendingLimitLoading,
  swap,
  swapError,
}) => {
  const { t } = useTranslation();

  const tokenBalances = useMemo(
    () => getUniqueTokenBalances(...integratedSwapTokenBalances, ...nativeWrappedTokenBalances),
    [integratedSwapTokenBalances, nativeWrappedTokenBalances],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap || isWrappingNativeToken) {
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
  }, [
    asset.userWalletBalanceTokens,
    formValues.fromToken,
    tokenBalances,
    isUsingSwap,
    isWrappingNativeToken,
  ]);

  const { handleSubmit, isFormValid, formError } = useForm({
    toVToken: asset.vToken,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens: asset.userBorrowBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isUsingSwap,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
    isFromTokenApproved,
  });

  const repayableAmountTokens = useMemo(
    () => BigNumber.min(fromTokenUserWalletBalanceTokens || 0, asset.userBorrowBalanceTokens),
    [fromTokenUserWalletBalanceTokens, asset.userBorrowBalanceTokens],
  );

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const readableRepayableFromTokenAmountTokens = useFormatTokensToReadableValue({
    value: repayableAmountTokens,
    token: formValues.fromToken,
  });

  const isRepayingFullLoan = useMemo(
    () => formValues.fixedRepayPercentage === 100,
    [formValues.fixedRepayPercentage],
  );

  const handleRightMaxButtonClick = useCallback(() => {
    const updatedValues: Partial<FormValues> = {
      fixedRepayPercentage: undefined,
      amountTokens: '',
    };

    if (asset.userBorrowBalanceTokens.isEqualTo(0)) {
      // If user's borrow balance is 0, set input amount to 0
      updatedValues.amountTokens = '0';
    } else if (isUsingSwap) {
      // If using swap, set input amount to wallet balance
      updatedValues.amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed();
    } else if (
      fromTokenUserWalletBalanceTokens?.isGreaterThanOrEqualTo(asset.userBorrowBalanceTokens) &&
      (!fromTokenWalletSpendingLimitTokens ||
        fromTokenWalletSpendingLimitTokens.isEqualTo(0) ||
        fromTokenWalletSpendingLimitTokens.isGreaterThanOrEqualTo(asset.userBorrowBalanceTokens))
    ) {
      // If user can repay full loan or has no spending limit, set fixed repay percentage to 100%
      updatedValues.fixedRepayPercentage = 100;
    } else {
      // If user cannot repay full loan, set input amount to wallet balance
      updatedValues.amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed();
    }

    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      // If user has set a spending limit, consider it
      updatedValues.amountTokens = BigNumber.min(
        updatedValues.amountTokens || 0,
        fromTokenWalletSpendingLimitTokens,
      ).toFixed();
    }

    // Update form values with new values
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      ...updatedValues,
    }));
  }, [
    asset.userBorrowBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    setFormValues,
    isUsingSwap,
    fromTokenWalletSpendingLimitTokens,
  ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isIntegratedSwapFeatureEnabled || canWrapNativeToken ? (
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

      <div>
        <div className="flex gap-x-4">
          {PRESET_PERCENTAGES.map(percentage => (
            <QuaternaryButton
              key={`select-button-${percentage}`}
              className="flex-1"
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
      </div>

      {!isSubmitting && !isSwapLoading && (
        <Notice isRepayingFullLoan={isRepayingFullLoan} formError={formError} swap={swap} />
      )}

      <div className="space-y-2">
        <LabeledInlineContent
          label={
            isUsingSwap
              ? t('operationModal.repay.walletBalance')
              : t('operationModal.repay.repayableAmount')
          }
        >
          {isUsingSwap
            ? readableFromTokenUserWalletBalanceTokens
            : readableRepayableFromTokenAmountTokens}
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

      <Delimiter />

      {isUsingSwap && swap && (
        <>
          <SwapDetails action="repay" swap={swap} data-testid={TEST_IDS.swapDetails} />

          <Delimiter />
        </>
      )}

      <div className="space-y-6">
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
          isUsingSwap={isUsingSwap}
          formError={formError}
          fromToken={formValues.fromToken}
          fromTokenAmountTokens={formValues.amountTokens}
          approveFromToken={approveFromToken}
          isApproveFromTokenLoading={isApproveFromTokenLoading}
          isFromTokenApproved={isFromTokenApproved}
          isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
          isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
        />
      </div>
    </form>
  );
};

export interface RepayFormProps {
  asset: Asset;
  pool: Pool;
  userWalletNativeTokenBalanceData?: GetBalanceOfOutput;
  onCloseModal?: () => void;
}

const RepayForm: React.FC<RepayFormProps> = ({
  asset,
  pool,
  userWalletNativeTokenBalanceData,
  onCloseModal,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapFeatureEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();

  const nativeTokenGatewayContractAddress = useGetNativeTokenGatewayContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const canWrapNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.tokenWrapped],
  );

  const userWalletNativeTokenBalanceTokens = useMemo(() => {
    return userWalletNativeTokenBalanceData
      ? convertMantissaToTokens({
          token: asset.vToken.underlyingToken.tokenWrapped,
          value: userWalletNativeTokenBalanceData?.balanceMantissa,
        })
      : undefined;
  }, [asset.vToken.underlyingToken.tokenWrapped, userWalletNativeTokenBalanceData]);

  const shouldSelectNativeToken =
    canWrapNativeToken && userWalletNativeTokenBalanceTokens?.gt(asset.userWalletBalanceTokens);

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken:
      shouldSelectNativeToken && asset.vToken.underlyingToken.tokenWrapped
        ? asset.vToken.underlyingToken.tokenWrapped
        : asset.vToken.underlyingToken,
    fixedRepayPercentage: undefined,
  });

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  // a user is trying to wrap the chain's native token if
  // 1) the wrap/unwrap feature is enabled
  // 2) the selected fromToken is the native token
  // 3) the market's underlying token wraps the native token
  const isWrappingNativeToken = useMemo(
    () => canWrapNativeToken && !!formValues.fromToken.isNative,
    [canWrapNativeToken, formValues.fromToken],
  );

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapFeatureEnabled &&
      !isWrappingNativeToken &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [
      isIntegratedSwapFeatureEnabled,
      isWrappingNativeToken,
      formValues.fromToken,
      asset.vToken.underlyingToken,
    ],
  );

  const spenderAddress = useMemo(() => {
    if (isWrappingNativeToken) {
      return nativeTokenGatewayContractAddress;
    }
    if (isUsingSwap) {
      return swapRouterContractAddress;
    }

    return asset.vToken.address;
  }, [
    isWrappingNativeToken,
    isUsingSwap,
    asset.vToken.address,
    nativeTokenGatewayContractAddress,
    swapRouterContractAddress,
  ]);

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
    poolComptrollerAddress: pool.comptrollerAddress,
  });

  const { mutateAsync: onSwapAndRepay, isLoading: isSwapAndRepayLoading } = useSwapTokensAndRepay({
    poolName: pool.name,
    poolComptrollerAddress: pool.comptrollerAddress,
    vToken: asset.vToken,
  });

  const isSubmitting = isRepayLoading || isSwapAndRepayLoading;

  const nativeWrappedTokenBalances: TokenBalance[] = useMemo(() => {
    if (asset.vToken.underlyingToken.tokenWrapped && userWalletNativeTokenBalanceData) {
      const marketTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      };
      const nativeTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken.tokenWrapped,
        balanceMantissa: userWalletNativeTokenBalanceData.balanceMantissa,
      };
      return [marketTokenBalance, nativeTokenBalance];
    }
    return [];
  }, [
    asset.userWalletBalanceTokens,
    asset.vToken.underlyingToken,
    userWalletNativeTokenBalanceData,
  ]);

  const { data: integratedSwapTokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const onSubmit: RepayFormUiProps['onSubmit'] = useCallback(
    async ({ fromToken, fromTokenAmountTokens, swap, fixedRepayPercentage }) => {
      const repayFullLoan = fixedRepayPercentage === 100;
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      // Handle repay flow
      if (!isUsingSwap) {
        return onRepay({
          amountMantissa,
          repayFullLoan,
          wrap: isWrappingNativeToken,
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
        repayFullLoan,
        swap,
      });
    },
    [isUsingSwap, onRepay, isWrappingNativeToken, onSwapAndRepay],
  );

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
      isIntegratedSwapFeatureEnabled={isIntegratedSwapFeatureEnabled}
      canWrapNativeToken={canWrapNativeToken}
      isWrappingNativeToken={isWrappingNativeToken}
      isUsingSwap={isUsingSwap}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      nativeWrappedTokenBalances={nativeWrappedTokenBalances}
      integratedSwapTokenBalances={integratedSwapTokenBalancesData}
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
