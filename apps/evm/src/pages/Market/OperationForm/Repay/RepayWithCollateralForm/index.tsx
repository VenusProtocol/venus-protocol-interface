import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  type GetExactInSwapQuoteInput,
  type GetExactOutSwapQuoteInput,
  useGetSwapQuote,
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
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool } from 'types';
import {
  areTokensEqual,
  compareBigNumbers,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
import { ApyBreakdown } from '../../ApyBreakdown';
import { OperationDetails } from '../../OperationDetails';
import { SubmitSection } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

// TODO: add tests

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

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const isSubmitting = false; // TODO: wire up

  const onSubmit: UseFormInput['onSubmit'] = async () => {
    // TODO: wire up
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
    | Omit<GetExactOutSwapQuoteInput, 'chainId'> =
    formValues.direction === 'exact-in'
      ? {
          ...sharedSwapQuoteProps,
          fromTokenAmountTokens: debouncedInputCollateralAmountTokens,
          direction: 'exact-in',
        }
      : {
          ...sharedSwapQuoteProps,
          toTokenAmountTokens: debouncedInputRepaidAmountTokens,
          direction: 'exact-out',
        };

  const { data: getSwapQuoteData, error: getSwapQuoteError } = useGetSwapQuote(swapQuoteInput, {
    enabled:
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
    .sort((a, b) => compareBigNumbers(a.userSupplyBalanceTokens, b.userSupplyBalanceTokens, 'desc'))
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

  // Automatically update form values based on fetched swap
  useEffect(() => {
    if (swapQuote?.direction === 'exact-in') {
      console.log('in');
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        repaidAmountTokens: convertMantissaToTokens({
          value: swapQuote.expectedToTokenAmountReceivedMantissa,
          token: swapQuote.toToken,
        }).toFixed(),
      }));
    } else if (swapQuote?.direction === 'exact-out') {
      console.log('out');
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        collateralAmountTokens: convertMantissaToTokens({
          value: swapQuote.expectedFromTokenAmountSoldMantissa,
          token: swapQuote.fromToken,
        }).toFixed(),
      }));
    }
  }, [swapQuote]);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: collateralAsset.vToken.address,
      action: 'withdraw',
      amountTokens: new BigNumber(swapQuote ? formValues.collateralAmountTokens : 0),
    },
    {
      type: 'asset',
      vTokenAddress: repaidAsset.vToken.address,
      action: 'repay',
      amountTokens: new BigNumber(swapQuote ? formValues.repaidAmountTokens : 0),
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
      collateralAmountTokens: limitTokens.toFixed(),
    }));
  };

  const handleMaxRepaidButtonClick = () => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      repaidAmountTokens: repaidAsset.userBorrowBalanceTokens.toFixed(),
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
                  Number(formValues.collateralAmountTokens) > 0 &&
                  !!formError &&
                  formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT' &&
                  formError.code !== 'MISSING_DATA' &&
                  formError.code !== 'HIGHER_THAN_BORROW_BALANCE'
                }
                disabled={isDisabled}
                onChange={collateralAmountTokens =>
                  setFormValues(currentFormValues => ({
                    ...currentFormValues,
                    collateralAmountTokens,
                    direction: 'exact-in',
                  }))
                }
                onChangeSelectedToken={collateralToken =>
                  setFormValues(currentFormValues => ({
                    ...currentFormValues,
                    collateralToken,
                  }))
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

            <Icon name="arrowRightFull" className="rotate-90 size-6 mb-1 mx-auto text-grey" />

            <TokenTextField
              data-testid={TEST_IDS.selectRepaidTokenTextField}
              token={repaidAsset.vToken.underlyingToken}
              value={formValues.repaidAmountTokens}
              label={t('operationForm.repaidField.label')}
              hasError={
                !isSubmitting &&
                Number(formValues.repaidAmountTokens) > 0 &&
                !!formError &&
                formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT' &&
                formError.code !== 'MISSING_DATA' &&
                formError.code !== 'HIGHER_THAN_AVAILABLE_AMOUNT'
              }
              disabled={isDisabled}
              onChange={repaidAmountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  repaidAmountTokens,
                  direction: 'exact-out',
                }))
              }
              description={
                !isSubmitting &&
                !!formError &&
                formError.code !== 'HIGHER_THAN_AVAILABLE_AMOUNT' &&
                formError.code !== 'NO_SWAP_QUOTE_FOUND' ? (
                  <p className="text-red">{formError.message}</p>
                ) : undefined
              }
              rightMaxButton={{
                label: t('operationForm.rightMaxButtonLabel'),
                onClick: handleMaxRepaidButtonClick,
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
            isFormSubmitting={isSubmitting}
            isFormValid={isFormValid}
            formErrorCode={formError?.code}
            poolComptrollerContractAddress={pool.comptrollerAddress}
          />

          <SwapDetails
            fromToken={collateralAsset.vToken.underlyingToken}
            toToken={repaidAsset.vToken.underlyingToken}
            priceImpactPercentage={swapQuote?.priceImpactPercentage}
          />
        </div>
      </ConnectWallet>
    </form>
  );
};
