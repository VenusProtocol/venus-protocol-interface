import BigNumber from 'bignumber.js';

import { useGetProportionalCloseTolerancePercentage } from 'clients/api';
import { AvailableBalance, Delimiter, LabeledSlider, TokenTextField } from 'components';
import type { Approval } from 'containers/TxFormSubmitButton';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateYieldPlusMutations } from 'hooks/useSimulateYieldPlusPositionMutations';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import type { Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import { Footer } from '../Footer';
import { calculateMaxLeverageFactor } from '../calculateMaxLeverageFactor';
import { SelectDsaTokenTextField } from './SelectDsaTokenTextField';
import {
  type WeightedAveragePriceImpactItem,
  calculateWeightedAverageSwapPriceImpact,
} from './calculateWeightedAverageSwapPriceImpact';
import type { PositionFormProps } from './types';
import { useFormValidation } from './useFormValidation';

export * from './types';

export const PositionForm: React.FC<PositionFormProps> = ({
  action,
  position,
  setFormValues,
  formValues,
  limitShortTokens,
  limitLongTokens,
  balanceMutations,
  submitButtonLabel,
  actionSwapQuote,
  actionSwapQuoteErrorCode,
  profitSwapQuote,
  profitSwapQuoteErrorCode,
  lossSwapQuote,
  lossSwapQuoteErrorCode,
  isSubmitting,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  // Reset form when any of the selected tokens change
  // biome-ignore lint:correctness/useExhaustiveDependencies
  useEffect(() => {
    setFormValues(currFormValues => ({
      ...currFormValues,
      dsaAmountTokens: '',
      shortAmountTokens: '',
    }));
  }, [
    setFormValues,
    position.dsaAsset.vToken.underlyingToken,
    position.longAsset.vToken.underlyingToken,
    position.shortAsset.vToken.underlyingToken,
  ]);

  const { data: getSimulatedYieldPlusMutationsData } = useSimulateYieldPlusMutations({
    position,
    balanceMutations,
  });
  const simulatedPosition = getSimulatedYieldPlusMutationsData?.position;

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

  const weightedAveragePriceImpactItems: WeightedAveragePriceImpactItem[] = [];

  if (actionSwapQuote) {
    weightedAveragePriceImpactItems.push({
      swapQuote: actionSwapQuote,
      fromTokenPriceCents: position.shortAsset.tokenPriceCents,
    });
  }

  if (profitSwapQuote) {
    weightedAveragePriceImpactItems.push({
      swapQuote: profitSwapQuote,
      fromTokenPriceCents: position.longAsset.tokenPriceCents,
    });
  }

  if (lossSwapQuote) {
    weightedAveragePriceImpactItems.push({
      swapQuote: lossSwapQuote,
      fromTokenPriceCents: position.dsaAsset.tokenPriceCents,
    });
  }

  const weightedAveragePriceImpactPercentage =
    weightedAveragePriceImpactItems.length > 0
      ? calculateWeightedAverageSwapPriceImpact(weightedAveragePriceImpactItems)
      : undefined;

  const { formError } = useFormValidation({
    balanceMutations,
    position,
    simulatedPosition,
    formValues,
    firstSwapQuoteErrorCode:
      actionSwapQuoteErrorCode || profitSwapQuoteErrorCode || lossSwapQuoteErrorCode,
    averageSwapPriceImpactPercentage: weightedAveragePriceImpactPercentage,
    limitShortTokens,
    action,
  });

  const maximumLeverageFactor =
    typeof proportionalCloseTolerancePercentage === 'number'
      ? calculateMaxLeverageFactor({
          dsaTokenCollateralFactor: position.dsaAsset.collateralFactor,
          longTokenCollateralFactor: position.longAsset.collateralFactor,
          proportionalCloseTolerancePercentage,
        })
      : position.leverageFactor;

  // Clamp leverage factor to the maximum possible
  useEffect(() => {
    if (formValues.leverageFactor > maximumLeverageFactor) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        leverageFactor: maximumLeverageFactor,
      }));
    }
  }, [formValues.leverageFactor, maximumLeverageFactor, setFormValues]);

  // Clamp short amount to the maximum possible
  useEffect(() => {
    if (
      action !== 'reduce' &&
      limitShortTokens &&
      formValues.shortAmountTokens &&
      new BigNumber(formValues.shortAmountTokens).isGreaterThan(limitShortTokens)
    ) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        shortAmountTokens: limitShortTokens.toFixed(),
      }));
    }
  }, [formValues.shortAmountTokens, limitShortTokens, setFormValues, action]);

  // Clamp long amount to the maximum possible
  useEffect(() => {
    if (
      action === 'reduce' &&
      limitLongTokens &&
      formValues.longAmountTokens &&
      new BigNumber(formValues.longAmountTokens).isGreaterThan(limitLongTokens)
    ) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        longAmountTokens: limitLongTokens.toFixed(),
      }));
    }
  }, [formValues.longAmountTokens, limitLongTokens, setFormValues, action]);

  const isDisabled =
    !isUserConnected ||
    isSubmitting ||
    formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
    formError?.code === 'SUPPLY_CAP_ALREADY_REACHED';

  // Convert short amount to percentage of limit
  let sliderValue = 0;

  if (action !== 'reduce' && limitShortTokens && Number(formValues.shortAmountTokens) > 0) {
    sliderValue = new BigNumber(formValues.shortAmountTokens)
      .multipliedBy(100)
      .div(limitShortTokens)
      .dp(1)
      .toNumber();
  } else if (action === 'reduce' && limitLongTokens && Number(formValues.longAmountTokens) > 0) {
    sliderValue = new BigNumber(formValues.longAmountTokens)
      .multipliedBy(100)
      .div(limitLongTokens)
      .dp(1)
      .toNumber();
  }

  const handleSliderChange = (riskLevelPercentage: number) => {
    // Open/increase position
    if (action !== 'reduce' && limitShortTokens) {
      const shortAmountTokens = limitShortTokens
        .multipliedBy(riskLevelPercentage)
        .div(100)
        .dp(position.shortAsset.vToken.underlyingToken.decimals)
        .toFixed();

      setFormValues(currentFormValues => ({
        ...currentFormValues,
        shortAmountTokens,
      }));

      return;
    }

    // Reduce position
    if (limitLongTokens) {
      const longAmountTokens = limitLongTokens
        .multipliedBy(riskLevelPercentage)
        .div(100)
        .dp(position.longAsset.vToken.underlyingToken.decimals)
        .toFixed();

      setFormValues(currentFormValues => ({
        ...currentFormValues,
        longAmountTokens,
      }));
    }
  };

  const handleLimitClick = () =>
    setFormValues(currentFormValues => {
      if (action !== 'reduce' && limitShortTokens) {
        return {
          ...currentFormValues,
          shortAmountTokens: limitShortTokens.toFixed(),
        };
      }

      if (action === 'reduce' && limitLongTokens) {
        return {
          ...currentFormValues,
          longAmountTokens: limitLongTokens.toFixed(),
        };
      }

      // This case should never be reached, this is just a safe guard
      return currentFormValues;
    });

  const readableLimit = formatTokensToReadableValue(
    action !== 'reduce'
      ? {
          value: limitShortTokens,
          token: position.shortAsset.vToken.underlyingToken,
        }
      : {
          value: limitLongTokens,
          token: position.longAsset.vToken.underlyingToken,
        },
  );

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (formError) {
      return;
    }

    try {
      await onSubmit(formValues);

      setFormValues(currFormValues => ({
        ...currFormValues,
        dsaAmountTokens: '',
        longAmountTokens: '',
        shortAmountTokens: '',
        acknowledgeRisk: false,
        acknowledgeHighPriceImpact: false,
      }));
    } catch (error) {
      handleError({ error });
    }
  };

  const approval: Approval | undefined =
    // Only request approval if user is supplying DSA
    simulatedPosition?.dsaBalanceCents &&
    position.dsaBalanceCents < simulatedPosition.dsaBalanceCents &&
    relativePositionManagerContractAddress
      ? {
          type: 'token',
          token: formValues.dsaToken,
          spenderAddress: relativePositionManagerContractAddress,
        }
      : undefined;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {action === 'open' && (
        <>
          <SelectDsaTokenTextField
            proportionalCloseTolerancePercentage={proportionalCloseTolerancePercentage ?? 1}
            shortTokenPriceCents={position.shortAsset.tokenPriceCents}
            shortTokenDecimals={position.shortAsset.vToken.underlyingToken.decimals}
            longTokenPriceCents={position.longAsset.tokenPriceCents}
            longTokenCollateralFactor={position.longAsset.userCollateralFactor}
            dsaTokenCollateralFactor={position.dsaAsset.userCollateralFactor}
            tokenPriceCents={position.dsaAsset.tokenPriceCents.toNumber()}
            selectedToken={formValues.dsaToken}
            leverageFactor={formValues.leverageFactor}
            maximumLeverageFactor={maximumLeverageFactor}
            onChangeLeverageFactor={(newLeverageFactor: number) =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                leverageFactor: newLeverageFactor,
              }))
            }
            name="dsaAmountTokens"
            onChange={(newDsaAmountTokens: string) =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                dsaAmountTokens: newDsaAmountTokens,
              }))
            }
            onChangeSelectedToken={(newDsaToken: Token) =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                dsaToken: newDsaToken,
              }))
            }
            value={formValues.dsaAmountTokens}
            label={t('yieldPlus.operationForm.openForm.dsaFieldLabel')}
            disabled={isDisabled}
            hasError={
              !!accountAddress &&
              !isSubmitting &&
              (formError?.code === 'HIGHER_THAN_WALLET_BALANCE' ||
                formError?.code === 'HIGHER_THAN_WALLET_SPENDING_LIMIT' ||
                formError?.code === 'HIGHER_THAN_SUPPLY_CAP')
            }
            formError={
              !!accountAddress &&
              !isSubmitting &&
              (formError?.code === 'EMPTY_DSA_TOKEN_AMOUNT' ||
                formError?.code === 'HIGHER_THAN_WALLET_BALANCE' ||
                formError?.code === 'HIGHER_THAN_WALLET_SPENDING_LIMIT' ||
                formError?.code === 'HIGHER_THAN_SUPPLY_CAP')
                ? formError
                : undefined
            }
          />

          <Delimiter />
        </>
      )}

      <TokenTextField
        name="longAmountTokens"
        value={formValues.longAmountTokens}
        tokenPriceCents={position.longAsset.tokenPriceCents.toNumber()}
        onChange={newLongAmountTokens =>
          setFormValues(currFormValues => ({
            ...currFormValues,
            longAmountTokens: newLongAmountTokens,
          }))
        }
        token={position.longAsset.vToken.underlyingToken}
        label={t('yieldPlus.operationForm.openForm.longFieldLabel')}
        disabled={isDisabled || action !== 'reduce'}
        description={
          !!accountAddress &&
          !isSubmitting &&
          formError &&
          (formError.code === 'NO_SWAP_QUOTE_FOUND' ||
            formError.code === 'HIGHER_THAN_SUPPLY_CAP' ||
            formError.code === 'HIGHER_THAN_LIQUIDITY') ? (
            <p className="text-red">{formError.message}</p>
          ) : undefined
        }
        hasError={
          !!accountAddress &&
          !isSubmitting &&
          (formError?.code === 'HIGHER_THAN_SUPPLY_CAP' ||
            formError?.code === 'HIGHER_THAN_LIQUIDITY')
        }
      />

      <TokenTextField
        name="shortAmountTokens"
        value={formValues.shortAmountTokens}
        tokenPriceCents={position.shortAsset.tokenPriceCents.toNumber()}
        onChange={newShortAmountTokens =>
          setFormValues(currFormValues => ({
            ...currFormValues,
            shortAmountTokens: newShortAmountTokens,
          }))
        }
        token={position.shortAsset.vToken.underlyingToken}
        label={t('yieldPlus.operationForm.openForm.shortFieldLabel')}
        disabled={isDisabled || action === 'reduce'}
        hasError={
          !!accountAddress &&
          !isSubmitting &&
          formError?.code === 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT'
        }
        description={
          !!accountAddress &&
          !isSubmitting &&
          (formError?.code === 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT' ||
            formError?.code === 'BORROW_CAP_ALREADY_REACHED') ? (
            <p className="text-red">{formError.message}</p>
          ) : undefined
        }
      />

      <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

      <LabeledSlider value={sliderValue} onChange={handleSliderChange} disabled={isDisabled} />

      <Delimiter />

      <Footer
        isLoading={isLoading || isSubmitting}
        position={position}
        simulatedPosition={simulatedPosition}
        swapPriceImpactPercentage={weightedAveragePriceImpactPercentage}
        swapFromToken={position.shortAsset.vToken.underlyingToken}
        swapToToken={position.longAsset.vToken.underlyingToken}
        submitButtonLabel={submitButtonLabel}
        isFormValid={!formError}
        balanceMutations={balanceMutations}
        action={action}
        isUserAcknowledgingHighPriceImpact={formValues.acknowledgeHighPriceImpact}
        setAcknowledgeHighPriceImpact={acknowledgeHighPriceImpact =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            acknowledgeHighPriceImpact,
          }))
        }
        approval={approval}
        isUserAcknowledgingRisk={formValues.acknowledgeRisk}
        setAcknowledgeRisk={acknowledgeRisk =>
          setFormValues(currentFormValues => ({
            ...currentFormValues,
            acknowledgeRisk,
          }))
        }
      />
    </form>
  );
};
