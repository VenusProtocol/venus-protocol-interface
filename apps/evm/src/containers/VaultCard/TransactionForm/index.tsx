import BigNumber from 'bignumber.js';
import type { UseFormReturn } from 'react-hook-form';
import type { Address } from 'viem';

import {
  type GetPendleSwapQuoteOutput,
  type PendleSwapQuoteError,
  useGetBalanceOf,
} from 'clients/api';
import { AvailableBalance, LabeledSlider, NoticeInfo, SpendingLimit } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { RhfTokenTextField } from 'containers/Form';
import { type Approval, TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import useTokenApproval from 'hooks/useTokenApproval';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect } from 'react';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';
import { formatTokensToReadableValue } from 'utilities/formatTokensToReadableValue';
import type { FormValues } from '../useForm';
import { getPendleQuoteValidationMessage } from './getPendleQuoteValidationMessage';

export interface TransactionFormProps {
  form: UseFormReturn<FormValues>;
  fromToken: Token;
  limitFromTokens: BigNumber;
  fromTokenFieldLabel: string;
  submitButtonLabel: string;
  onSubmit: () => Promise<unknown>;
  isLoading?: boolean;
  fromTokenPriceCents?: number;
  footer?: React.ReactNode;
  spenderAddress?: Address;
  swapFromToken?: Token;
  swapToToken?: Token;
  swapQuote?: GetPendleSwapQuoteOutput;
  swapQuoteError?: PendleSwapQuoteError;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  fromToken,
  fromTokenPriceCents,
  form,
  limitFromTokens,
  fromTokenFieldLabel,
  spenderAddress,
  submitButtonLabel,
  onSubmit,
  isLoading: isLoadingProp = false,
  footer,
  swapFromToken,
  swapToToken,
  swapQuote,
  swapQuoteError,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const fromAmountTokensFieldValue = form.watch('fromAmountTokens');
  const fromAmountTokens = new BigNumber(fromAmountTokensFieldValue || 0);

  // Check if transaction is using a swap with a high price impact
  const isHighPriceImpactSwap =
    swapQuote?.priceImpactPercentage !== undefined &&
    swapQuote.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
    swapQuote.priceImpactPercentage < MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE;

  const isUserAcknowledgingHighPriceImpact = form.watch('acknowledgeHighPriceImpact');

  const approval: Approval | undefined =
    spenderAddress && fromAmountTokens.isGreaterThan(0)
      ? {
          type: 'token',
          spenderAddress,
          token: fromToken,
        }
      : undefined;

  const {
    isWalletSpendingLimitLoading,
    walletSpendingLimitTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
    isApproveTokenLoading,
  } = useTokenApproval({
    token: fromToken,
    spenderAddress,
    accountAddress,
  });

  const { data: getFromTokenBalanceData, isLoading: isGetFromTokenWalletBalanceLoading } =
    useGetBalanceOf(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        token: fromToken,
      },
      {
        enabled: !!accountAddress,
      },
    );
  const walletBalanceFromTokens =
    getFromTokenBalanceData &&
    convertMantissaToTokens({
      value: getFromTokenBalanceData.balanceMantissa,
      token: fromToken,
    });

  const quoteValidationMessage = getPendleQuoteValidationMessage({
    quoteError: swapQuoteError ?? undefined,
    t,
  });

  useEffect(() => {
    if (quoteValidationMessage) {
      form.setError('fromAmountTokens', {
        message: quoteValidationMessage,
      });
    }
  }, [form.setError, quoteValidationMessage]);

  useEffect(() => {
    if (
      swapQuote?.priceImpactPercentage &&
      swapQuote.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      form.setError('fromAmountTokens', {
        message: t('operationForm.error.priceImpactTooHigh'),
      });
    }
  }, [form.setError, swapQuote?.priceImpactPercentage, t]);

  const readableLimit = formatTokensToReadableValue({
    value: limitFromTokens,
    token: fromToken,
  });

  const handleLimitClick = () =>
    form.setValue('fromAmountTokens', limitFromTokens.dp(fromToken.decimals).toFixed(), {
      shouldDirty: true,
      shouldValidate: true,
    });

  const handleSliderChange = (percentage: number) => {
    const amountTokens = limitFromTokens
      .multipliedBy(percentage)
      .div(100)
      .dp(fromToken.decimals)
      .toFixed();

    form.setValue('fromAmountTokens', amountTokens, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const sliderValue = limitFromTokens.isGreaterThan(0)
    ? (Number(fromAmountTokens.toNumber()) * 100) / limitFromTokens.toNumber()
    : 0;

  const isLoading =
    isGetFromTokenWalletBalanceLoading ||
    isWalletSpendingLimitLoading ||
    isApproveTokenLoading ||
    form.formState.isSubmitting ||
    isLoadingProp;

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    try {
      await onSubmit();

      form.reset();
    } catch (error) {
      handleError({ error });
    }
  };

  let isFormValid = form.formState.isValid;

  const requiresSwap = !!swapFromToken && !!swapToToken;

  if (requiresSwap) {
    const riskAcknowledged = !isHighPriceImpactSwap || isUserAcknowledgingHighPriceImpact;
    isFormValid = isFormValid && !!swapQuote && riskAcknowledged;
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-y-4">
      {!!accountAddress && (
        <>
          <RhfTokenTextField<FormValues>
            label={fromTokenFieldLabel}
            control={form.control}
            name="fromAmountTokens"
            token={fromToken}
            tokenPriceCents={fromTokenPriceCents}
          />

          <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

          {!!spenderAddress && (
            <SpendingLimit
              token={fromToken}
              walletBalanceTokens={walletBalanceFromTokens}
              walletSpendingLimitTokens={walletSpendingLimitTokens}
              onRevoke={revokeWalletSpendingLimit}
              isRevokeLoading={isRevokeWalletSpendingLimitLoading}
            />
          )}

          <LabeledSlider value={sliderValue} onChange={handleSliderChange} />
        </>
      )}

      {footer && <div>{footer}</div>}

      <TxFormSubmitButton
        approval={approval}
        submitButtonLabel={submitButtonLabel}
        isFormValid={isFormValid}
        isLoading={isLoading}
        isUserAcknowledgingHighPriceImpact={isUserAcknowledgingHighPriceImpact}
        setAcknowledgeHighPriceImpact={acknowledgeHighPriceImpact =>
          form.setValue('acknowledgeHighPriceImpact', acknowledgeHighPriceImpact)
        }
        swapFromToken={swapFromToken}
        swapToToken={swapToToken}
        swapPriceImpactPercentage={swapQuote?.priceImpactPercentage}
      />

      {!accountAddress && <NoticeInfo description={t('vault.modals.connectWalletMessage')} />}
    </form>
  );
};
