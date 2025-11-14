import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  Delimiter,
  Icon,
  LabeledInlineContent,
  type OptionalTokenBalance,
  RiskAcknowledgementToggle,
  TokenListWrapper,
  TokenTextField,
} from 'components';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import useDebounceValue from 'hooks/useDebounceValue';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool, Swap, Token } from 'types';
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
import SubmitSection from './SubmitSection';
import { calculateUserMaxBorrowTokens } from './calculateUserMaxBorrowTokens';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

// TODO: add tests

export interface BoostFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
}

const BoostForm: React.FC<BoostFormProps> = ({ asset: borrowedAsset, pool, onSubmitSuccess }) => {
  const { accountAddress } = useAccountAddress();

  const initialFormValues: FormValues = useMemo(() => {
    let initialSuppliedAsset = borrowedAsset;

    // Find asset with the highest collateral factor and initialize form with it
    let highestCollateralFactor = 0;

    pool.assets.forEach(a => {
      if (a.userCollateralFactor > highestCollateralFactor) {
        highestCollateralFactor = a.userCollateralFactor;
        initialSuppliedAsset = a;
      }
    });

    const values: FormValues = {
      amountTokens: '',
      suppliedToken: initialSuppliedAsset.vToken.underlyingToken,
      acknowledgeRisk: false,
    };

    return values;
  }, [borrowedAsset, pool.assets]);

  const [isTokenListShown, setIsTokenListShown] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const suppliedAsset =
    pool.assets.find(a => areTokensEqual(a.vToken.underlyingToken, formValues.suppliedToken)) ||
    borrowedAsset;

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

  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const userBorrowingPowerCents = pool.userBorrowLimitCents?.minus(
    pool.userBorrowBalanceCents || 0,
  );

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

  // TODO: fetch
  const swap: Swap | undefined = debouncedInputAmountTokens.isGreaterThan(0)
    ? {
        fromToken: borrowedAsset.vToken.underlyingToken,
        toToken: suppliedAsset.vToken.underlyingToken,
        exchangeRate: new BigNumber(1),
        priceImpactPercentage: 0.08,
        routePath: [],
        fromTokenAmountSoldMantissa: convertTokensToMantissa({
          value: debouncedInputAmountTokens,
          token: borrowedAsset.vToken.underlyingToken,
        }),
        expectedToTokenAmountReceivedMantissa: convertTokensToMantissa({
          value: new BigNumber(1000),
          token: suppliedAsset.vToken.underlyingToken,
        }),
        minimumToTokenAmountReceivedMantissa: convertTokensToMantissa({
          value: new BigNumber(900),
          token: suppliedAsset.vToken.underlyingToken,
        }),
        direction: 'exactAmountIn',
      }
    : undefined;

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: borrowedAsset.vToken.underlyingToken,
  });

  const tokenBalances = userBorrowingPowerCents
    ? [...pool.assets]
        // Sort by collateral factor
        .sort((a, b) => compareNumbers(a.userCollateralFactor, b.userCollateralFactor, 'desc'))
        .reduce<OptionalTokenBalance[]>((acc, asset) => {
          // Skip tokens that can't be collaterals
          if (asset.userCollateralFactor === 0 || asset.vToken.symbol === 'vBNB') {
            return acc;
          }

          const tokenBalance: OptionalTokenBalance = {
            token: asset.vToken.underlyingToken,
          };

          return [...acc, tokenBalance];
        }, [])
    : [];

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: suppliedAsset.vToken.address,
      action: 'supply',
      amountTokens: swap?.minimumToTokenAmountReceivedMantissa
        ? convertMantissaToTokens({
            value: swap.minimumToTokenAmountReceivedMantissa,
            token: suppliedAsset.vToken.underlyingToken,
          })
        : new BigNumber(0),
    },
    {
      type: 'asset',
      vTokenAddress: borrowedAsset.vToken.address,
      action: 'borrow',
      amountTokens: debouncedInputAmountTokens,
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
    asset: borrowedAsset,
    pool,
    simulatedPool,
    limitTokens,
    onSubmitSuccess,
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
          >
            <div className="flex gap-x-1">
              <TokenTextField
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
                  formError.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT'
                }
              />

              <Icon name="arrowRightFull" className="mt-10 size-6" />

              <SelectTokenField
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

          {/* TODO: add step to allow Comptroller contract as delegate */}

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
            isFormSubmitting={isSubmitting}
            isFormValid={isFormValid}
            formErrorCode={formError?.code}
          />

          <SwapDetails
            fromToken={borrowedAsset.vToken.underlyingToken}
            toToken={suppliedAsset.vToken.underlyingToken}
            priceImpactPercentage={swap?.priceImpactPercentage}
          />
        </div>
      </ConnectWallet>
    </form>
  );
};

export default BoostForm;
