import BigNumber from 'bignumber.js';

import { AvailableBalance, Delimiter, RiskSlider, TokenTextField } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation, SwapQuote, Token, YieldPlusPosition } from 'types';
import { formatTokensToReadableValue, getSwapToTokenAmountReceivedTokens } from 'utilities';
import { Footer } from '../Footer';
import { SelectDsaTokenTextField } from './SelectDsaTokenTextField';
import type { FormError } from './types';

export interface FormValues {
  leverageFactor: number;
  dsaToken: Token;
  dsaAmountTokens: string;
  shortAmountTokens: string;
  acknowledgeRisk: boolean;
  acknowledgeHighPriceImpact: boolean;
}

export interface PositionFormProps {
  formValues: FormValues;
  setFormValues: (setter: FormValues | ((newFormValues: FormValues) => FormValues)) => void;
  limitShortTokens: BigNumber;
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  submitButtonLabel: string;
  formError?: FormError;
  isLoading?: boolean;
  simulatedPosition?: YieldPlusPosition;
  swapQuote?: SwapQuote;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  position,
  simulatedPosition,
  setFormValues,
  formValues,
  limitShortTokens,
  balanceMutations,
  submitButtonLabel,
  swapQuote,
  formError,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const isOpeningNewPosition = position.dsaBalanceTokens.isEqualTo(0);

  const expectedLongAmountTokens = getSwapToTokenAmountReceivedTokens(swapQuote);

  // Convert short amount to percentage of limit
  const riskSliderValue =
    limitShortTokens.isGreaterThan(0) && Number(formValues.shortAmountTokens) > 0
      ? new BigNumber(formValues.shortAmountTokens)
          .multipliedBy(100)
          .div(limitShortTokens)
          .dp(1)
          .toNumber()
      : 0;

  const handleRiskSliderChange = (riskLevelPercentage: number) => {
    const shortAmountTokens = limitShortTokens
      .multipliedBy(riskLevelPercentage)
      .div(100)
      .dp(position.shortAsset.vToken.underlyingToken.decimals)
      .toFixed();

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      shortAmountTokens,
    }));
  };

  const handleLimitClick = () =>
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      shortAmountTokens: limitShortTokens.toFixed(),
    }));

  const readableLimitShort = formatTokensToReadableValue({
    value: limitShortTokens,
    token: position.shortAsset.vToken.underlyingToken,
  });

  const handleSubmit = () => {};

  const isSubmitting = false; // TODO: get from props (?)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {/* TODO: display form errors */}

      {/* TODO: add leverage factor selector */}

      {isOpeningNewPosition && (
        <SelectDsaTokenTextField
          selectedToken={formValues.dsaToken}
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
          label={t('yieldPLus.operationForm.openForm.dsaFieldLabel')}
          disabled={!isUserConnected}
          formError={
            !!accountAddress &&
            !isSubmitting &&
            Number(formValues.dsaAmountTokens) > 0 &&
            (formError?.code === 'EMPTY_DSA_TOKEN_AMOUNT' ||
              formError?.code === 'HIGHER_THAN_WALLET_BALANCE' ||
              formError?.code === 'HIGHER_THAN_WALLET_SPENDING_LIMIT')
              ? formError
              : undefined
          }
        />
      )}

      <Delimiter />

      <TokenTextField
        name="longAmountTokens"
        value={expectedLongAmountTokens?.toFixed() || ''}
        onChange={newLongAmountTokens =>
          setFormValues(currFormValues => ({
            ...currFormValues,
            longAmountTokens: newLongAmountTokens,
          }))
        }
        token={position.longAsset.vToken.underlyingToken}
        label={t('yieldPLus.operationForm.openForm.longFieldLabel')}
        disabled
      />

      <TokenTextField
        name="longAmountTokens"
        value={formValues.shortAmountTokens}
        onChange={newShortAmountTokens =>
          setFormValues(currFormValues => ({
            ...currFormValues,
            shortAmountTokens: newShortAmountTokens,
          }))
        }
        token={position.shortAsset.vToken.underlyingToken}
        label={t('yieldPLus.operationForm.openForm.shortFieldLabel')}
        disabled={!isUserConnected}
      />

      <AvailableBalance readableBalance={readableLimitShort} onClick={handleLimitClick} />

      <RiskSlider
        value={riskSliderValue}
        onChange={handleRiskSliderChange}
        disabled={!isUserConnected}
      />

      <Delimiter />

      <Footer
        isLoading={isLoading}
        position={position}
        simulatedPosition={simulatedPosition}
        swapQuote={swapQuote}
        swapFromToken={position.shortAsset.vToken.underlyingToken}
        swapToToken={position.longAsset.vToken.underlyingToken}
        submitButtonLabel={submitButtonLabel}
        isFormValid={!formError}
        balanceMutations={balanceMutations}
        isOpeningNewPosition={isOpeningNewPosition}
      />
    </form>
  );
};
