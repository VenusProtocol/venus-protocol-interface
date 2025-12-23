import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  type GetApproximateOutSwapQuoteInput,
  type GetExactInSwapQuoteInput,
  useGetSwapQuote,
  useRepayWithCollateral,
} from 'clients/api';
import {
  Icon,
  LabeledInlineContent,
  type OptionalTokenBalance,
  RiskAcknowledgementToggle,
  SelectTokenTextField,
  TokenTextField,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool } from 'types';
import {
  buffer,
  areTokensEqual,
  compareBigNumbers,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
import { ApyBreakdown } from '../../ApyBreakdown';
import { OperationDetails } from '../../OperationDetails';
import { Notice } from '../Notice';
import { SubmitSection } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface RepayWithCollateralFormProps {
  asset: Asset;
  pool: Pool;
}

export const RepayWithCollateralForm: React.FC<RepayWithCollateralFormProps> = ({
  pool,
  asset: repaidAsset,
}) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const { mutateAsync: repayWithCollateral, isPending: isRepayWithCollateralLoading } =
    useRepayWithCollateral();

  const initialFormValues: FormValues = useMemo(() => {
    let initialCollateralAsset = repaidAsset;

    // Find asset with the highest collateral factor and initialize form with it
    let highestUserSupplyCents = new BigNumber(0);

    pool.assets.forEach(a => {
      if (a.userSupplyBalanceCents.isGreaterThan(highestUserSupplyCents)) {
        highestUserSupplyCents = a.userSupplyBalanceCents;
        initialCollateralAsset = a;
      }
    });

    const values: FormValues = {
      direction: 'exact-in',
      collateralToken: initialCollateralAsset.vToken.underlyingToken,
      collateralAmountTokens: '',
      repaidAmountTokens: '',
      acknowledgeRisk: false,
      repayFullLoan: false,
    };

    return values;
  }, [repaidAsset, pool.assets]);

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const collateralAsset =
    pool.assets.find(a => areTokensEqual(a.vToken.underlyingToken, formValues.collateralToken)) ||
    repaidAsset;

  const limitTokens = collateralAsset.userSupplyBalanceTokens;

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: collateralAsset.vToken.underlyingToken,
  });

  // If a user is using the same market to borrow and supply, then we don't use the swap (the
  // borrowed tokens are directly resupplied to the same market
  const isUsingSwap = !areTokensEqual(collateralAsset.vToken, repaidAsset.vToken);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const isSubmitting = isRepayWithCollateralLoading;

  const onSubmit: UseFormInput['onSubmit'] = async () => {
    if (!isUsingSwap) {
      let amountMantissa = BigInt(
        convertTokensToMantissa({
          value: new BigNumber(formValues.collateralAmountTokens),
          token: formValues.collateralToken,
        }).toFixed(),
      );

      amountMantissa = formValues.repayFullLoan
        ? // Buff amount to cover accrued interests while the transaction is being mined if we're
          // repaying a full loan without using a swap
          buffer({
            amountMantissa,
          })
        : amountMantissa;

      return repayWithCollateral({
        vToken: collateralAsset.vToken,
        amountMantissa,
      });
    }

    if (!swapQuote) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return repayWithCollateral({
      collateralVToken: collateralAsset.vToken,
      repaidVToken: repaidAsset.vToken,
      swapQuote,
    });
  };

  const _debouncedInputCollateralAmountTokens = useDebounceValue(formValues.collateralAmountTokens);
  const debouncedInputCollateralAmountTokens = new BigNumber(
    _debouncedInputCollateralAmountTokens || 0,
  );

  const _debouncedInputRepaidAmountTokens = useDebounceValue(formValues.repaidAmountTokens);
  const debouncedInputRepaidAmountTokens = new BigNumber(_debouncedInputRepaidAmountTokens || 0);

  const sharedSwapQuoteProps = {
    fromToken: collateralAsset.vToken.underlyingToken,
    toToken: repaidAsset.vToken.underlyingToken,
    recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
    slippagePercentage: userSlippageTolerancePercentage,
  };

  const swapQuoteInput:
    | Omit<GetExactInSwapQuoteInput, 'chainId'>
    | Omit<GetApproximateOutSwapQuoteInput, 'chainId'> =
    formValues.direction === 'exact-in'
      ? {
          ...sharedSwapQuoteProps,
          fromTokenAmountTokens: debouncedInputCollateralAmountTokens,
          direction: 'exact-in',
        }
      : {
          ...sharedSwapQuoteProps,
          minToTokenAmountTokens: formValues.repayFullLoan
            ? convertMantissaToTokens({
                value:
                  // Buff amount if we're repaying full loan to account for accrued interests while
                  // transaction is being mined
                  buffer({
                    amountMantissa: BigInt(
                      convertTokensToMantissa({
                        value: repaidAsset.userBorrowBalanceTokens,
                        token: repaidAsset.vToken.underlyingToken,
                      }).toFixed(),
                    ),
                  }),
                token: repaidAsset.vToken.underlyingToken,
              })
            : debouncedInputRepaidAmountTokens,
          direction: 'approximate-out',
        };

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetSwapQuote(swapQuoteInput, {
    enabled:
      isUsingSwap &&
      !!leverageManagerContractAddress &&
      Number(
        formValues.direction === 'exact-in'
          ? formValues.collateralAmountTokens
          : formValues.repaidAmountTokens,
      ) > 0,
  });
  const swapQuote = getSwapQuoteData?.swapQuote;

  const tokenBalances = [...pool.assets]
    // Sort by user supply balance
    .sort((a, b) => compareBigNumbers(a.userSupplyBalanceCents, b.userSupplyBalanceCents, 'desc'))
    .reduce<OptionalTokenBalance[]>((acc, asset) => {
      if (
        // Skip vBNB
        asset.vToken.symbol === 'vBNB' ||
        // Skip tokens for which user has no supply
        asset.userSupplyBalanceCents.isEqualTo(0)
      ) {
        return acc;
      }

      const tokenBalance: OptionalTokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          value: asset.userSupplyBalanceTokens,
          token: asset.vToken.underlyingToken,
        }),
      };

      return [...acc, tokenBalance];
    }, []);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: collateralAsset.vToken.address,
      action: 'withdraw',
      amountTokens:
        !isUsingSwap || swapQuote ? debouncedInputCollateralAmountTokens : new BigNumber(0),
    },
    {
      type: 'asset',
      vTokenAddress: repaidAsset.vToken.address,
      action: 'repay',
      amountTokens: !isUsingSwap || swapQuote ? debouncedInputRepaidAmountTokens : new BigNumber(0),
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const isRiskyOperation =
    simulatedPool?.userHealthFactor !== undefined &&
    simulatedPool?.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

  const { handleSubmit, isFormValid, formError } = useForm({
    limitTokens,
    repaidAsset,
    simulatedPool,
    onSubmit,
    formValues,
    setFormValues,
    initialFormValues,
    swapQuote,
    isUsingSwap,
    getSwapQuoteError: getSwapQuoteError || undefined,
  });

  const handleToggleAcknowledgeRisk = (checked: boolean) => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      acknowledgeRisk: checked,
    }));
  };

  const handleMaxCollateralButtonClick = () => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      // If user is repaying a debt using the same token as collateral, then the
      // amount to repay is the same as the amount of collateral to sell
      repaidAmountTokens: isUsingSwap
        ? currentFormValues.repaidAmountTokens
        : limitTokens.toFixed(),
      collateralAmountTokens: limitTokens.toFixed(),
      repayFullLoan: false,
      direction: 'exact-in',
    }));
  };

  const handleMaxRepaidButtonClick = () => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      repaidAmountTokens: repaidAsset.userBorrowBalanceTokens.toFixed(),
      direction: 'approximate-out',
      repayFullLoan: true,
    }));
  };

  const shouldAskUserRiskAcknowledgement =
    isRiskyOperation && (!formError || formError?.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT');

  const isDisabled = !accountAddress || isSubmitting;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-1">
          <div>
            <div className="space-y-2">
              <SelectTokenTextField
                data-testid={TEST_IDS.selectCollateralTokenTextField}
                selectedToken={formValues.collateralToken}
                value={formValues.collateralAmountTokens}
                label={t('operationForm.collateralField.label')}
                hasError={
                  !isSubmitting &&
                  !!formError &&
                  formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT' &&
                  formError.code !== 'MISSING_DATA' &&
                  formError.code !== 'EMPTY_TOKEN_AMOUNT' &&
                  formError.code !== 'HIGHER_THAN_BORROW_BALANCE'
                }
                disabled={isDisabled}
                onChange={collateralAmountTokens => {
                  setFormValues(currentFormValues => ({
                    ...currentFormValues,
                    collateralAmountTokens,
                    // If user is repaying a debt using the same token as collateral, then the
                    // amount to repay is the same as the amount of collateral to sell
                    repaidAmountTokens: isUsingSwap ? '' : collateralAmountTokens,
                    repayFullLoan: false,
                    direction: 'exact-in',
                  }));
                }}
                onChangeSelectedToken={collateralToken =>
                  setFormValues(currentFormValues => {
                    const updatedIsUsingSwap = areTokensEqual(
                      collateralToken,
                      repaidAsset.vToken.underlyingToken,
                    );

                    return {
                      ...currentFormValues,
                      collateralAmountTokens:
                        updatedIsUsingSwap && currentFormValues.repayFullLoan
                          ? currentFormValues.repaidAmountTokens
                          : currentFormValues.collateralAmountTokens,
                      repaidAmountTokens:
                        updatedIsUsingSwap && !currentFormValues.repayFullLoan
                          ? currentFormValues.collateralAmountTokens
                          : currentFormValues.repaidAmountTokens,
                      collateralToken,
                    };
                  })
                }
                tokenBalances={tokenBalances}
                description={
                  !isSubmitting &&
                  !!formError &&
                  formError.code !== 'HIGHER_THAN_BORROW_BALANCE' ? (
                    <p className="text-red">{formError.message}</p>
                  ) : undefined
                }
              />

              {!!accountAddress && (
                <LabeledInlineContent
                  label={t('operationForm.availableAmount')}
                  data-testid={TEST_IDS.availableAmount}
                >
                  <button
                    className="transition-colors hover:text-blue"
                    type="button"
                    onClick={handleMaxCollateralButtonClick}
                  >
                    {readableLimit}
                  </button>
                </LabeledInlineContent>
              )}
            </div>

            <Icon
              name="arrowRightFull"
              className={cn('rotate-90 size-6 mb-1 mx-auto text-grey', !accountAddress && 'mt-7')}
            />

            <TokenTextField
              data-testid={TEST_IDS.selectRepaidTokenTextField}
              token={repaidAsset.vToken.underlyingToken}
              value={formValues.repaidAmountTokens}
              label={t('operationForm.repaidField.label')}
              hasError={
                !isSubmitting &&
                Number(formValues.repaidAmountTokens) > 0 &&
                !!formError &&
                formError.code === 'HIGHER_THAN_BORROW_BALANCE'
              }
              disabled={isDisabled}
              onChange={repaidAmountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  // If user is repaying a debt using the same token as collateral, then the amount
                  // amount to repay is the same as the amount of collateral to sell
                  collateralAmountTokens: isUsingSwap ? '' : repaidAmountTokens,
                  repaidAmountTokens,
                  repayFullLoan: false,
                  direction: 'approximate-out',
                }))
              }
              description={
                !isSubmitting && !!formError && formError.code === 'HIGHER_THAN_BORROW_BALANCE' ? (
                  <p className="text-red">{formError.message}</p>
                ) : undefined
              }
              rightMaxButton={{
                label: t('operationForm.rightMaxButtonLabel'),
                onClick: handleMaxRepaidButtonClick,
                active: formValues.repayFullLoan,
              }}
            />
          </div>
        </div>

        {!accountAddress && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}
      </div>

      <ConnectWallet
        className={cn('space-y-4', accountAddress ? 'mt-4' : 'mt-6')}
        // TODO: add analytic variant
      >
        <div className="space-y-4">
          <Notice
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            isRepayingFullLoan={formValues.repayFullLoan}
            priceImpactPercentage={swapQuote?.priceImpactPercentage}
          />

          <OperationDetails
            action="borrow"
            pool={pool}
            simulatedPool={simulatedPool}
            balanceMutations={balanceMutations}
            showApyBreakdown={false}
          />

          {shouldAskUserRiskAcknowledgement && (
            <RiskAcknowledgementToggle
              value={formValues.acknowledgeRisk}
              onChange={(_, checked) => handleToggleAcknowledgeRisk(checked)}
            />
          )}
        </div>

        <div className="space-y-3">
          <SubmitSection
            isLoading={isSubmitting || isGetSwapQuoteLoading}
            isFormValid={isFormValid}
            formError={formError}
            poolComptrollerContractAddress={pool.comptrollerAddress}
          />

          {isUsingSwap && (
            <SwapDetails
              fromToken={collateralAsset.vToken.underlyingToken}
              toToken={repaidAsset.vToken.underlyingToken}
              priceImpactPercentage={swapQuote?.priceImpactPercentage}
            />
          )}
        </div>
      </ConnectWallet>
    </form>
  );
};
