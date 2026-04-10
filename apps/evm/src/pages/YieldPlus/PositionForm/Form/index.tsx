import BigNumber from 'bignumber.js';

import { useGetProportionalCloseTolerancePercentage } from 'clients/api';
import {
  AvailableBalance,
  Delimiter,
  LabeledSlider,
  TokenTextField,
  type TokenTextFieldProps,
} from 'components';
import type { Approval } from 'containers/TxFormSubmitButton';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateYieldPlusMutations } from 'hooks/useSimulateYieldPlusPositionMutations';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { MINIMUM_LEVERAGE_FACTOR } from 'pages/YieldPlus/constants';
import { useEffect } from 'react';
import type { Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import { calculateMaxLeverageFactor } from '../../calculateMaxLeverageFactor';
import { Footer } from './Footer';
import { SelectDsaTokenTextField } from './SelectDsaTokenTextField';
import { WalletBalance } from './WalletBalance';
import {
  type WeightedAveragePriceImpactItem,
  calculateWeightedAverageSwapPriceImpact,
} from './calculateWeightedAverageSwapPriceImpact';
import type { FormProps } from './types';
import { useFormValidation } from './useFormValidation';

export * from './types';

export const Form: React.FC<FormProps> = ({
  action,
  position,
  setFormValues,
  formValues,
  limitShortTokens,
  limitDsaTokens,
  balanceMutations,
  submitButtonLabel,
  repaySwapQuote,
  repaySwapQuoteErrorCode,
  profitSwapQuote,
  profitSwapQuoteErrorCode,
  lossSwapQuote,
  lossSwapQuoteErrorCode,
  isSubmitting,
  pnlDsaTokens,
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
    if (action !== 'close') {
      setFormValues(currFormValues => ({
        ...currFormValues,
        dsaAmountTokens: '',
        shortAmountTokens: '',
      }));
    }
  }, [
    action,
    setFormValues,
    position.dsaAsset.vToken.underlyingToken,
    position.longAsset.vToken.underlyingToken,
    position.shortAsset.vToken.underlyingToken,
  ]);

  const { data: getSimulatedYieldPlusMutationsData } = useSimulateYieldPlusMutations({
    dsaAmountTokens: new BigNumber(formValues.dsaAmountTokens || 0),
    position,
    balanceMutations,
  });
  const simulatedPosition = getSimulatedYieldPlusMutationsData?.position;

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

  const weightedAveragePriceImpactItems: WeightedAveragePriceImpactItem[] = [];

  if (repaySwapQuote) {
    weightedAveragePriceImpactItems.push({
      swapQuote: repaySwapQuote,
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

  const firstSwapQuoteErrorCode =
    repaySwapQuoteErrorCode || profitSwapQuoteErrorCode || lossSwapQuoteErrorCode;

  const expectedSwapQuoteCount = action === 'reduce' ? 2 : 1;

  const weightedAveragePriceImpactPercentage =
    !firstSwapQuoteErrorCode && weightedAveragePriceImpactItems.length >= expectedSwapQuoteCount
      ? calculateWeightedAverageSwapPriceImpact(weightedAveragePriceImpactItems)
      : undefined;

  const { formError } = useFormValidation({
    balanceMutations,
    position,
    simulatedPosition,
    formValues,
    firstSwapQuoteErrorCode,
    averageSwapPriceImpactPercentage: weightedAveragePriceImpactPercentage,
    limitShortTokens,
    limitDsaTokens,
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

  // Clamp leverage factor
  useEffect(() => {
    if (formValues.leverageFactor > maximumLeverageFactor) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        leverageFactor:
          maximumLeverageFactor > MINIMUM_LEVERAGE_FACTOR
            ? maximumLeverageFactor
            : MINIMUM_LEVERAGE_FACTOR,
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

  // Reset long amount when short amount is set to 0
  useEffect(() => {
    const shortAmount = new BigNumber(formValues.shortAmountTokens || 0);

    if (action !== 'close' && shortAmount.isZero()) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        longAmountTokens: '',
      }));
    }
  }, [action, formValues.shortAmountTokens, setFormValues]);

  const isDisabled =
    !isUserConnected ||
    isSubmitting ||
    formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
    formError?.code === 'SUPPLY_CAP_ALREADY_REACHED';

  const isUpdatingCollateralBalance = action === 'supplyDsa' || action === 'withdrawDsa';

  const limitTokens = isUpdatingCollateralBalance ? limitDsaTokens : limitShortTokens;
  const sliderRefValueTokens = isUpdatingCollateralBalance
    ? formValues.dsaAmountTokens
    : formValues.shortAmountTokens;

  // Convert short amount to percentage of limit
  const sliderValue =
    limitTokens?.isGreaterThan(0) && Number(sliderRefValueTokens) > 0
      ? new BigNumber(sliderRefValueTokens).multipliedBy(100).div(limitTokens).dp(1).toNumber()
      : 0;

  const handleSliderChange = (percentage: number) => {
    if (limitTokens) {
      const amountTokens = limitTokens
        .multipliedBy(percentage)
        .div(100)
        .dp(
          (isUpdatingCollateralBalance ? position.dsaAsset : position.shortAsset).vToken
            .underlyingToken.decimals,
        )
        .toFixed();

      setFormValues(currentFormValues => {
        const updatedValues = { ...currentFormValues };

        if (isUpdatingCollateralBalance) {
          updatedValues.dsaAmountTokens = amountTokens;
        } else {
          updatedValues.shortAmountTokens = amountTokens;
        }

        return updatedValues;
      });
    }
  };

  const handleLimitClick = () => {
    if (limitTokens) {
      setFormValues(currentFormValues => {
        const updatedValues = { ...currentFormValues };

        const limitTokensValue = limitTokens.toFixed();

        if (isUpdatingCollateralBalance) {
          updatedValues.dsaAmountTokens = limitTokensValue;
        } else {
          updatedValues.shortAmountTokens = limitTokensValue;
        }

        return updatedValues;
      });
    }
  };

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: isUpdatingCollateralBalance
      ? position.dsaAsset.vToken.underlyingToken
      : position.shortAsset.vToken.underlyingToken,
  });

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

  const isManagingDsa = action === 'supplyDsa' || action === 'withdrawDsa';
  const canDisplayFormError = !!accountAddress && !isSubmitting;

  let hasDsaAmountError =
    formError?.code === 'HIGHER_THAN_WALLET_BALANCE' ||
    formError?.code === 'HIGHER_THAN_WALLET_SPENDING_LIMIT' ||
    formError?.code === 'HIGHER_THAN_SUPPLY_CAP';

  if (isManagingDsa) {
    hasDsaAmountError =
      hasDsaAmountError ||
      formError?.code === 'HIGHER_THAN_AVAILABLE_AMOUNT' ||
      formError?.code === 'HIGHER_THAN_AVAILABLE_DSA_AMOUNT';
  }

  const dsaTokenTextFieldProps: Pick<
    TokenTextFieldProps,
    | 'value'
    | 'label'
    | 'disabled'
    | 'hasError'
    | 'description'
    | 'name'
    | 'onChange'
    | 'tokenPriceCents'
  > = {
    value: formValues.dsaAmountTokens,
    label: t('yieldPlus.operationForm.openForm.dsaFieldLabel'),
    disabled: isDisabled,
    hasError: canDisplayFormError && hasDsaAmountError,
    description:
      canDisplayFormError && hasDsaAmountError && formError ? (
        <p className="text-red">{formError.message}</p>
      ) : undefined,
    name: 'dsaAmountTokens',
    onChange: (newDsaAmountTokens: string) =>
      setFormValues(currFormValues => ({
        ...currFormValues,
        dsaAmountTokens: newDsaAmountTokens,
      })),
    tokenPriceCents: position.dsaAsset.tokenPriceCents.toNumber(),
  };

  const isClosingPositionWithoutSwap =
    action === 'close' &&
    position.shortBalanceTokens.isZero() &&
    position.longBalanceTokens.isZero();

  const shouldShowSwapDetails =
    isUpdatingCollateralBalance || isClosingPositionWithoutSwap ? false : true;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {action === 'close' && !isLoading && formError && (
        <p className="text-red text-b1r">{formError.message}</p>
      )}

      {action === 'open' && (
        <>
          <SelectDsaTokenTextField
            {...dsaTokenTextFieldProps}
            proportionalCloseTolerancePercentage={proportionalCloseTolerancePercentage ?? 1}
            shortTokenPriceCents={position.shortAsset.tokenPriceCents}
            shortTokenDecimals={position.shortAsset.vToken.underlyingToken.decimals}
            longTokenPriceCents={position.longAsset.tokenPriceCents}
            longTokenCollateralFactor={position.longAsset.userCollateralFactor}
            dsaTokenCollateralFactor={position.dsaAsset.userCollateralFactor}
            selectedToken={formValues.dsaToken}
            leverageFactor={formValues.leverageFactor}
            maximumLeverageFactor={maximumLeverageFactor}
            placeholder={t('yieldPlus.operationForm.openForm.dsaFieldPlaceholder')}
            autoFocus
            onChangeLeverageFactor={(newLeverageFactor: number) =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                leverageFactor: newLeverageFactor,
              }))
            }
            onChangeSelectedToken={(newDsaToken: Token) =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                dsaToken: newDsaToken,
              }))
            }
          />

          <WalletBalance
            token={formValues.dsaToken}
            onBalanceClick={walletBalanceTokens =>
              setFormValues(currFormValues => ({
                ...currFormValues,
                dsaAmountTokens: walletBalanceTokens.toFixed(),
              }))
            }
          />

          <Delimiter />
        </>
      )}

      {(action === 'supplyDsa' || action === 'withdrawDsa') && (
        <>
          <TokenTextField {...dsaTokenTextFieldProps} token={formValues.dsaToken} />

          {action === 'supplyDsa' ? (
            <WalletBalance
              token={formValues.dsaToken}
              onBalanceClick={walletBalanceTokens =>
                setFormValues(currFormValues => ({
                  ...currFormValues,
                  dsaAmountTokens: walletBalanceTokens.toFixed(),
                }))
              }
            />
          ) : (
            <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />
          )}
        </>
      )}

      {(action === 'open' || action === 'increase' || action === 'reduce') && (
        <>
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
            disabled
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
            disabled={isDisabled}
            hasError={
              canDisplayFormError &&
              (formError?.code === 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT' ||
                formError?.code === 'SWAP_PRICE_IMPACT_TOO_HIGH')
            }
            description={
              canDisplayFormError &&
              (formError?.code === 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT' ||
                formError?.code === 'BORROW_CAP_ALREADY_REACHED' ||
                formError?.code === 'SWAP_PRICE_IMPACT_TOO_HIGH') ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />

          <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />
        </>
      )}

      {action !== 'close' && (
        <>
          <LabeledSlider value={sliderValue} onChange={handleSliderChange} disabled={isDisabled} />

          <Delimiter />
        </>
      )}

      <Footer
        isLoading={isLoading || isSubmitting}
        position={position}
        simulatedPosition={simulatedPosition}
        swapPriceImpactPercentage={weightedAveragePriceImpactPercentage}
        swapFromToken={
          shouldShowSwapDetails ? position.shortAsset.vToken.underlyingToken : undefined
        }
        swapToToken={shouldShowSwapDetails ? position.longAsset.vToken.underlyingToken : undefined}
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
        pnlDsaTokens={pnlDsaTokens}
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
