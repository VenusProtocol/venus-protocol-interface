import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useGetSwapQuote, useOpenLeveragedPosition } from 'clients/api';
import {
  Delimiter,
  Icon,
  LabeledInlineContent,
  type OptionalTokenBalance,
  RiskAcknowledgementToggle,
  TokenListWrapper,
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
import { useAnalytics } from 'libs/analytics';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool, Token } from 'types';
import {
  areTokensEqual,
  compareNumbers,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';
import { ApyBreakdown } from '../ApyBreakdown';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import { RiskSlider } from './RiskSlider';
import { SelectTokenField } from './SelectTokenField';
import { SubmitSection } from './SubmitSection';
import { calculateUserMaxBorrowTokens } from './calculateUserMaxBorrowTokens';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface BoostFormProps {
  asset: Asset;
  pool: Pool;
}

const BoostForm: React.FC<BoostFormProps> = ({ asset: borrowedAsset, pool }) => {
  const { accountAddress } = useAccountAddress();

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const userBorrowingPowerCents = useMemo(
    () => pool.userBorrowLimitCents?.minus(pool.userBorrowBalanceCents || 0),
    [pool],
  );

  const tokenBalances = useMemo(
    () =>
      userBorrowingPowerCents
        ? [...pool.assets]
            // Sort by collateral factor
            .sort((a, b) => compareNumbers(a.userCollateralFactor, b.userCollateralFactor, 'desc'))
            .reduce<OptionalTokenBalance[]>((acc, asset) => {
              if (
                asset.userCollateralFactor === 0 ||
                // Skip vBNB
                asset.vToken.symbol === 'vBNB' ||
                // Skip tokens that have reached their supply cap
                asset.supplyBalanceTokens.isGreaterThanOrEqualTo(asset.supplyCapTokens)
              ) {
                return acc;
              }

              const tokenBalance: OptionalTokenBalance = {
                token: asset.vToken.underlyingToken,
              };

              return [...acc, tokenBalance];
            }, [])
        : [],
    [pool.assets, userBorrowingPowerCents],
  );

  const initialFormValues: FormValues = useMemo(() => {
    const values: FormValues = {
      amountTokens: '',
      suppliedToken:
        tokenBalances.length > 0 ? tokenBalances[0].token : borrowedAsset.vToken.underlyingToken,
      acknowledgeRisk: false,
    };

    return values;
  }, [tokenBalances, borrowedAsset]);

  const [isTokenListShown, setIsTokenListShown] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const suppliedAsset =
    pool.assets.find(a => areTokensEqual(a.vToken.underlyingToken, formValues.suppliedToken)) ||
    borrowedAsset;

  // If a user is using the same market to borrow and supply, then we don't use the swap (the
  // borrowed tokens are directly resupplied to the same market
  const isUsingSwap = !areTokensEqual(borrowedAsset.vToken, suppliedAsset.vToken);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  const { mutateAsync: openLeveragedPosition, isPending: isOpenLeveragedPositionLoading } =
    useOpenLeveragedPosition();

  const isSubmitting = isOpenLeveragedPositionLoading;

  const onSubmit: UseFormInput['onSubmit'] = async () => {
    if (!isUsingSwap) {
      const amountMantissa = BigInt(
        convertTokensToMantissa({
          value: new BigNumber(formValues.amountTokens),
          token: formValues.suppliedToken,
        }).toFixed(),
      );

      return openLeveragedPosition({
        vToken: borrowedAsset.vToken,
        amountMantissa,
      });
    }

    if (swapQuote?.direction !== 'exact-in') {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return openLeveragedPosition({
      swapQuote,
      borrowedVToken: borrowedAsset.vToken,
      suppliedVToken: suppliedAsset.vToken,
    });
  };

  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  // Calculate maximum amount of tokens user can borrow
  let limitTokens = new BigNumber(0);

  if (userBorrowingPowerCents?.isGreaterThan(0)) {
    limitTokens = calculateUserMaxBorrowTokens({
      borrowedAsset,
      suppliedAsset,
      userBorrowingPowerCents,
    });
  }

  const _debouncedInputAmountTokens = useDebounceValue(formValues.amountTokens);
  const debouncedInputAmountTokens = new BigNumber(_debouncedInputAmountTokens || 0);

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: borrowedAsset.vToken.underlyingToken,
      fromTokenAmountTokens: debouncedInputAmountTokens,
      toToken: formValues.suppliedToken,
      direction: 'exact-in',
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled:
        isUsingSwap &&
        !!leverageManagerContractAddress &&
        debouncedInputAmountTokens.isGreaterThan(0),
    },
  );
  const swapQuote = getSwapQuoteData?.swapQuote;

  let expectedSuppliedAmountTokens = undefined;

  if (isUsingSwap && swapQuote?.direction === 'exact-in') {
    expectedSuppliedAmountTokens = convertMantissaToTokens({
      value: swapQuote.expectedToTokenAmountReceivedMantissa,
      token: suppliedAsset.vToken.underlyingToken,
    });
  } else if (!isUsingSwap) {
    expectedSuppliedAmountTokens = debouncedInputAmountTokens;
  }

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: borrowedAsset.vToken.underlyingToken,
  });

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: suppliedAsset.vToken.address,
      action: 'supply',
      amountTokens: expectedSuppliedAmountTokens || new BigNumber(0),
      enableAsCollateralOfUser: true,
    },
    {
      type: 'asset',
      vTokenAddress: borrowedAsset.vToken.address,
      action: 'borrow',
      amountTokens: !isUsingSwap || swapQuote ? debouncedInputAmountTokens : new BigNumber(0),
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
    borrowedAsset,
    pool,
    simulatedPool,
    limitTokens,
    swapQuote,
    getSwapQuoteError: getSwapQuoteError || undefined,
    expectedSuppliedAmountTokens,
    onSubmit,
    formValues,
    setFormValues,
    initialFormValues,
  });

  // Convert input amount to percentage of limit
  const riskSliderValue =
    limitTokens.isGreaterThan(0) && Number(formValues.amountTokens) > 0
      ? new BigNumber(formValues.amountTokens).multipliedBy(100).div(limitTokens).dp(1).toNumber()
      : 0;

  const handleRiskSliderChange = (riskLevelPercentage: number) => {
    const amountTokens = limitTokens
      .multipliedBy(riskLevelPercentage)
      .div(100)
      .dp(borrowedAsset.vToken.underlyingToken.decimals)
      .toFixed();

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens,
    }));
  };

  const handleToggleAcknowledgeRisk = (checked: boolean) => {
    if (checked) {
      captureAnalyticEvent('borrow_risks_acknowledged', {
        poolName: pool.name,
        assetSymbol: borrowedAsset.vToken.underlyingToken.symbol,
        usdAmount: calculateAmountDollars({
          amountTokens: formValues.amountTokens,
          tokenPriceCents: borrowedAsset.tokenPriceCents,
        }),
        maxSelected: false,
        safeBorrowLimitExceeded: isRiskyOperation,
      });
    }

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      acknowledgeRisk: checked,
    }));
  };

  const handleMaxButtonClick = () => {
    captureAmountSetAnalyticEvent({
      amountTokens: limitTokens,
      maxSelected: true,
    });

    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: limitTokens.toFixed(),
    }));
  };

  const handleSuppliedTokenChange = (suppliedToken: Token) => {
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      suppliedToken,
    }));

    // Close token list
    setIsTokenListShown(false);
  };

  const handleAmountTokensFieldChange = (amountTokens: string) => {
    captureAmountSetAnalyticEvent({
      amountTokens,
      maxSelected: false,
    });

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens,
    }));
  };

  const captureAmountSetAnalyticEvent = ({
    amountTokens: _amountTokens,
    maxSelected: _maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean; selectedPercentage?: number }) => {
    // TODO: capture event
  };

  const shouldAskUserRiskAcknowledgement =
    isRiskyOperation && (!formError || formError?.code === 'REQUIRES_RISK_ACKNOWLEDGEMENT');

  const isDisabled =
    !accountAddress ||
    isSubmitting ||
    formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
    formError?.code === 'NO_COLLATERALS';

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-1">
          <TokenListWrapper
            tokenBalances={tokenBalances}
            selectedToken={suppliedAsset.vToken.underlyingToken}
            displayCommonTokenButtons={false}
            onTokenClick={handleSuppliedTokenChange}
            onClose={() => setIsTokenListShown(false)}
            isListShown={isTokenListShown}
            data-testid={TEST_IDS.selectTokenField}
          >
            <div className="flex gap-x-1">
              <TokenTextField
                data-testid={TEST_IDS.tokenTextField}
                className="flex-1"
                label={t('operationForm.borrow')}
                name="amountTokens"
                displayTokenIcon
                token={borrowedAsset.vToken.underlyingToken}
                value={formValues.amountTokens}
                onChange={handleAmountTokensFieldChange}
                disabled={isDisabled}
                hasError={
                  !!accountAddress &&
                  !isSubmitting &&
                  Number(formValues.amountTokens) > 0 &&
                  !!formError &&
                  formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT' &&
                  formError.code !== 'MISSING_DATA'
                }
              />

              <Icon name="arrowRightFull" className="mt-10 size-6" />

              <SelectTokenField
                data-testid={TEST_IDS.selectTokenField}
                className="flex-1"
                label={t('operationForm.supply')}
                token={suppliedAsset.vToken.underlyingToken}
                isActive={isTokenListShown}
                onButtonClick={() => setIsTokenListShown(true)}
                disabled={isDisabled}
              />
            </div>
          </TokenListWrapper>

          {!!accountAddress && !isSubmitting && !!formError?.message && (
            <p className="text-red text-sm">{formError.message}</p>
          )}
        </div>

        {!accountAddress && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}
      </div>

      <ConnectWallet
        className={cn('space-y-4', accountAddress ? 'mt-2' : 'mt-6')}
        // TODO: add analytic variant
      >
        <div className="space-y-4">
          <LabeledInlineContent
            label={t('operationForm.availableAmount')}
            data-testid={TEST_IDS.availableAmount}
          >
            <button
              className="transition-colors hover:text-blue"
              type="button"
              onClick={handleMaxButtonClick}
            >
              {readableLimit}
            </button>
          </LabeledInlineContent>

          <RiskSlider
            disabled={isDisabled}
            value={riskSliderValue}
            onChange={handleRiskSliderChange}
          />

          <Delimiter />

          <OperationDetails
            action="borrow"
            pool={pool}
            simulatedPool={simulatedPool}
            balanceMutations={balanceMutations}
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
            isRiskyOperation={isRiskyOperation}
            formError={formError}
            poolComptrollerContractAddress={pool.comptrollerAddress}
          />

          {isUsingSwap && (
            <SwapDetails
              fromToken={borrowedAsset.vToken.underlyingToken}
              toToken={suppliedAsset.vToken.underlyingToken}
              priceImpactPercentage={swapQuote?.priceImpactPercentage}
            />
          )}
        </div>
      </ConnectWallet>
    </form>
  );
};

export default BoostForm;
