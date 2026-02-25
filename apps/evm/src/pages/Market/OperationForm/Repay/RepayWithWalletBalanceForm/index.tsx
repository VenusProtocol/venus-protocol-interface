import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useGetSwapQuote, useRepay, useSwapTokensAndRepay } from 'clients/api';
import {
  LabeledInlineContent,
  QuaternaryButton,
  SelectTokenTextField,
  SpendingLimit,
  TokenTextField,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import useDebounceValue from 'hooks/useDebounceValue';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAnalytics } from 'libs/analytics';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, AssetBalanceMutation, Pool, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  getSwapToTokenAmountReceivedTokens,
  getUniqueTokenBalances,
} from 'utilities';
import { ApyBreakdown } from '../../ApyBreakdown';
import { Footer } from '../../Footer';
import type { Approval } from '../../Footer/types';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import { Notice } from '../Notice';
import { calculatePercentageOfUserBorrowBalance } from './calculatePercentageOfUserBorrowBalance';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayWithWalletBalanceFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
  userTokenWrappedBalanceMantissa?: BigNumber;
}

const RepayWithWalletBalanceForm: React.FC<RepayWithWalletBalanceFormProps> = ({
  asset,
  pool,
  onSubmitSuccess,
  userTokenWrappedBalanceMantissa,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapFeatureEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const isUserConnected = !!accountAddress;

  const { address: nativeTokenGatewayContractAddress } = useGetContractAddress({
    name: 'NativeTokenGateway',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const canWrapNativeToken =
    isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped;

  const userWalletNativeTokenBalanceTokens = userTokenWrappedBalanceMantissa
    ? convertMantissaToTokens({
        token: asset.vToken.underlyingToken.tokenWrapped,
        value: userTokenWrappedBalanceMantissa,
      })
    : undefined;

  const shouldSelectNativeToken =
    canWrapNativeToken && userWalletNativeTokenBalanceTokens?.gt(asset.userWalletBalanceTokens);

  const initialFormValues = useMemo(
    () => ({
      amountTokens: '',
      fromToken:
        shouldSelectNativeToken && asset.vToken.underlyingToken.tokenWrapped
          ? asset.vToken.underlyingToken.tokenWrapped
          : asset.vToken.underlyingToken,
      fixedRepayPercentage: undefined,
      acknowledgeHighPriceImpact: false,
    }),
    [asset, shouldSelectNativeToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouterV2',
  });

  // a user is trying to wrap the chain's native token if
  // 1) the wrap/unwrap feature is enabled
  // 2) the selected fromToken is the native token
  // 3) the market's underlying token wraps the native token
  const isWrappingNativeToken = useMemo(
    () => canWrapNativeToken && !!formValues.fromToken.isNative,
    [canWrapNativeToken, formValues.fromToken],
  );

  const isUsingSwap =
    isIntegratedSwapFeatureEnabled &&
    !isWrappingNativeToken &&
    !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken);

  const spenderAddress = (() => {
    if (isWrappingNativeToken) {
      return nativeTokenGatewayContractAddress;
    }
    if (isUsingSwap) {
      return swapRouterContractAddress;
    }

    return asset.vToken.address;
  })();

  const {
    isTokenApproved: isFromTokenApproved,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  const { mutateAsync: onRepay, isPending: isRepayLoading } = useRepay();

  const { mutateAsync: onSwapAndRepay, isPending: isSwapAndRepayLoading } = useSwapTokensAndRepay();

  const isSubmitting = isRepayLoading || isSwapAndRepayLoading;

  const nativeWrappedTokenBalances: TokenBalance[] = useMemo(() => {
    if (asset.vToken.underlyingToken.tokenWrapped && userTokenWrappedBalanceMantissa) {
      const marketTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      };
      const nativeTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken.tokenWrapped,
        balanceMantissa: userTokenWrappedBalanceMantissa,
      };
      return [marketTokenBalance, nativeTokenBalance];
    }
    return [];
  }, [
    asset.userWalletBalanceTokens,
    asset.vToken.underlyingToken,
    userTokenWrappedBalanceMantissa,
  ]);

  const { data: integratedSwapTokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const onSubmit: UseFormInput['onSubmit'] = useCallback(
    async ({ fromToken, fromTokenAmountTokens, swapQuote, fixedRepayPercentage }) => {
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
          vToken: asset.vToken,
          poolName: pool.name,
          poolComptrollerContractAddress: pool.comptrollerAddress,
        });
      }

      // Throw an error if we're meant to execute a swapQuote but no swapQuote was
      // passed through props. This should never happen since the form is
      // disabled while swapQuote infos are being fetched, but we add this logic
      // as a safeguard
      if (!swapQuote) {
        throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
      }

      // Handle swapQuote and repay flow
      return onSwapAndRepay({
        repayFullLoan,
        swapQuote,
        poolName: pool.name,
        poolComptrollerContractAddress: pool.comptrollerAddress,
        vToken: asset.vToken,
      });
    },
    [
      isUsingSwap,
      onRepay,
      isWrappingNativeToken,
      onSwapAndRepay,
      asset.vToken,
      pool.name,
      pool.comptrollerAddress,
    ],
  );

  const debouncedFormAmountTokens = useDebounceValue(formValues.amountTokens);
  const fromTokenAmountTokens = new BigNumber(debouncedFormAmountTokens || 0);

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const swapQuoteToTokenAmountTokens = formValues.fixedRepayPercentage
    ? new BigNumber(
        calculatePercentageOfUserBorrowBalance({
          userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
          token: asset.vToken.underlyingToken,
          percentage:
            formValues.fixedRepayPercentage === 100
              ? // Buff amount if we are repaying a full loan to account for accrued interests while
                // the transaction is being mined
                formValues.fixedRepayPercentage + FULL_REPAYMENT_BUFFER_PERCENTAGE
              : formValues.fixedRepayPercentage,
        }),
      )
    : undefined;

  const sharedSwapQuoteProps = {
    fromToken: formValues.fromToken,
    toToken: asset.vToken.underlyingToken,
    toTokenAmountTokens: swapQuoteToTokenAmountTokens || new BigNumber(0),
    recipientAddress: swapRouterContractAddress || NULL_ADDRESS,
    slippagePercentage: userSlippageTolerancePercentage,
  };

  const {
    data: swapQuoteData,
    error: swapQuoteError,
    isLoading: swapQuoteLoading,
  } = useGetSwapQuote(
    formValues.fixedRepayPercentage && swapQuoteToTokenAmountTokens
      ? {
          ...sharedSwapQuoteProps,
          minToTokenAmountTokens: swapQuoteToTokenAmountTokens,
          direction: 'approximate-out',
        }
      : {
          ...sharedSwapQuoteProps,
          fromTokenAmountTokens,
          direction: 'exact-in',
        },
    {
      enabled:
        isUsingSwap &&
        !!swapRouterContractAddress &&
        (formValues.fixedRepayPercentage
          ? !!swapQuoteToTokenAmountTokens?.isGreaterThan(0)
          : fromTokenAmountTokens.isGreaterThan(0)),
    },
  );

  const swapQuote = swapQuoteData?.swapQuote;

  const approval: Approval | undefined = spenderAddress
    ? {
        type: 'token',
        token: formValues.fromToken,
        spenderAddress,
      }
    : undefined;

  const tokenBalances = useMemo(
    () =>
      getUniqueTokenBalances(
        ...(integratedSwapTokenBalancesData || []),
        ...nativeWrappedTokenBalances,
      ),
    [integratedSwapTokenBalancesData, nativeWrappedTokenBalances],
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

  let repayToTokenAmountTokens = isUsingSwap
    ? getSwapToTokenAmountReceivedTokens(swapQuote)
    : debouncedFormAmountTokens;
  repayToTokenAmountTokens = new BigNumber(repayToTokenAmountTokens || 0);

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      action: 'repay',
      amountTokens:
        isUsingSwap && formValues.fixedRepayPercentage === 100
          ? asset.userBorrowBalanceTokens
          : repayToTokenAmountTokens,
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    pool,
    balanceMutations,
    toVToken: asset.vToken,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens: asset.userBorrowBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isUsingSwap,
    swapQuote,
    swapQuoteErrorCode: swapQuoteError?.code,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
    simulatedPool,
    isFromTokenApproved,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const isRepayingFullLoan = useMemo(
    () => formValues.fixedRepayPercentage === 100,
    [formValues.fixedRepayPercentage],
  );

  const limitTokens = useMemo(() => {
    let amountTokens = BigNumber.min(
      asset.userBorrowBalanceTokens,
      fromTokenUserWalletBalanceTokens || 0,
    );

    // If using swap, set input amount to wallet balance
    if (isUsingSwap) {
      amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0);
    }

    // If user has set a spending limit, consider it
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens || 0, fromTokenWalletSpendingLimitTokens);
    }

    return amountTokens;
  }, [
    asset.userBorrowBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isUsingSwap,
  ]);

  const captureAmountSetAnalyticEvent = ({
    amountTokens,
    maxSelected,
    selectedPercentage,
  }: { amountTokens: BigNumber | string; maxSelected: boolean; selectedPercentage?: number }) => {
    if (Number(amountTokens.toString()) > 0) {
      captureAnalyticEvent(
        'repay_amount_set',
        {
          poolName: pool.name,
          assetSymbol: asset.vToken.underlyingToken.symbol,
          usdAmount: calculateAmountDollars({
            amountTokens,
            tokenPriceCents: asset.tokenPriceCents,
          }),
          maxSelected,
          selectedPercentage,
        },
        {
          debounced: true,
        },
      );
    }
  };

  const handleRightMaxButtonClick = () => {
    const updatedValues: Partial<FormValues> = {
      fixedRepayPercentage: undefined,
    };

    const canRepayFullLoan =
      // If user is using swap, we don't know if they can repay the full loan after conversion
      !isUsingSwap &&
      limitTokens.isGreaterThan(0) &&
      limitTokens.isGreaterThanOrEqualTo(asset.userBorrowBalanceTokens);

    if (canRepayFullLoan) {
      // If user can repay full loan, set fixed repay percentage to 100%
      updatedValues.fixedRepayPercentage = 100;
    } else {
      updatedValues.amountTokens = limitTokens.toFixed();
    }

    captureAmountSetAnalyticEvent({
      amountTokens:
        canRepayFullLoan && !isUsingSwap
          ? calculatePercentageOfUserBorrowBalance({
              userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
              token: formValues.fromToken,
              percentage: 100,
            })
          : limitTokens,
      maxSelected: true,
    });

    // Update form values with new values
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      ...updatedValues,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {isIntegratedSwapFeatureEnabled || canWrapNativeToken ? (
          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            selectedToken={formValues.fromToken}
            value={formValues.amountTokens}
            hasError={
              !isSubmitting &&
              !!formError &&
              formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT' &&
              formError.code !== 'REQUIRES_SWAP_PRICE_IMPACT_ACKNOWLEDGEMENT' &&
              formError.code !== 'MISSING_DATA' &&
              formError.code !== 'EMPTY_TOKEN_AMOUNT' &&
              formError.code !== 'HIGHER_THAN_REPAY_BALANCE'
            }
            disabled={!isUserConnected || isSubmitting}
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({
                amountTokens,
                maxSelected: false,
              });

              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }));
            }}
            onChangeSelectedToken={fromToken =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                fromToken,
              }))
            }
            rightMaxButton={{
              label: t('operationForm.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            tokenBalances={tokenBalances}
            description={
              !isSubmitting && !!formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />
        ) : (
          <TokenTextField
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formValues.amountTokens}
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({
                amountTokens,
                maxSelected: false,
              });

              return setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
                // Reset selected fixed percentage
                fixedRepayPercentage: undefined,
              }));
            }}
            disabled={!isUserConnected || isSubmitting}
            rightMaxButton={{
              label: t('operationForm.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            data-testid={TEST_IDS.tokenTextField}
            hasError={
              isUserConnected && !isSubmitting && !!formError && Number(formValues.amountTokens) > 0
            }
            description={
              isUserConnected && !isSubmitting && !!formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />
        )}

        <div className="flex gap-x-2">
          {PRESET_PERCENTAGES.map(percentage => (
            <QuaternaryButton
              key={`select-button-${percentage}`}
              className="flex-1"
              size="xs"
              rounded
              active={percentage === formValues.fixedRepayPercentage}
              disabled={!isUserConnected || asset.userBorrowBalanceTokens.isEqualTo(0)}
              onClick={() => {
                if (!isUsingSwap) {
                  const amountTokens = calculatePercentageOfUserBorrowBalance({
                    userBorrowBalanceTokens: asset.userBorrowBalanceTokens,
                    token: formValues.fromToken,
                    percentage,
                  });

                  captureAmountSetAnalyticEvent({
                    amountTokens,
                    maxSelected: false,
                    selectedPercentage: percentage,
                  });
                }

                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  fixedRepayPercentage: percentage,
                }));
              }}
            >
              {formatPercentageToReadableValue(percentage)}
            </QuaternaryButton>
          ))}
        </div>

        {isUserConnected ? (
          <>
            <Notice
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
              isRepayingFullLoan={isRepayingFullLoan}
              priceImpactPercentage={swapQuote?.priceImpactPercentage}
            />

            <div className="space-y-2">
              <LabeledInlineContent label={t('operationForm.walletBalance')}>
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
          </>
        ) : (
          <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />
        )}

        <Footer
          analyticVariant="repay_with_wallet_form"
          balanceMutations={balanceMutations}
          pool={pool}
          submitButtonLabel={t('operationForm.submitButtonLabel.repay')}
          isFormValid={isFormValid}
          simulatedPool={simulatedPool}
          approval={approval}
          swapFromToken={isUsingSwap ? formValues.fromToken : undefined}
          swapToToken={isUsingSwap ? asset.vToken.underlyingToken : undefined}
          swapQuote={swapQuote}
          isUserAcknowledgingHighPriceImpact={formValues.acknowledgeHighPriceImpact}
          setAcknowledgeHighPriceImpact={acknowledgeHighPriceImpact =>
            setFormValues(currentFormValues => ({
              ...currentFormValues,
              acknowledgeHighPriceImpact,
            }))
          }
          isLoading={isSubmitting || swapQuoteLoading}
        />
      </div>
    </form>
  );
};

export default RepayWithWalletBalanceForm;
