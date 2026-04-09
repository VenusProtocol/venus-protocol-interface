import { cn } from '@venusprotocol/ui';

import type { GetPendleSwapQuoteOutput } from 'clients/api';
import { LabeledInlineContent } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { convertMantissaToTokens, formatCentsToReadableValue } from 'utilities';

export interface ConvertDetailsProps {
  fromToken: Token;
  toToken: Token;
  slippagePercentage: number;
  swapQuote?: GetPendleSwapQuoteOutput;
  className?: string;
}

export const PendleConvertDetails: React.FC<ConvertDetailsProps> = ({
  fromToken,
  toToken,
  slippagePercentage,
  swapQuote,
  className,
}) => {
  const { t } = useTranslation();

  const { estimatedReceivedTokensMantissa, feeCents } = swapQuote ?? {};

  const minReceivedMantissa =
    estimatedReceivedTokensMantissa && slippagePercentage
      ? estimatedReceivedTokensMantissa.times(1 - slippagePercentage / 100)
      : undefined;

  const readableFee = formatCentsToReadableValue({
    value: feeCents,
  });

  const readableMinReceived = minReceivedMantissa
    ? convertMantissaToTokens({
        value: minReceivedMantissa,
        token: toToken,
        returnInReadableFormat: true,
      })
    : PLACEHOLDER_KEY;

  const readableEstimatedReceived = estimatedReceivedTokensMantissa
    ? `≈ ${convertMantissaToTokens({
        value: estimatedReceivedTokensMantissa,
        token: toToken,
        returnInReadableFormat: true,
      })}`
    : PLACEHOLDER_KEY;

  return (
    <div className={cn('border border-lightGrey rounded-xl p-4 space-y-3', className)}>
      <LabeledInlineContent
        label={<div className="text-white">{t('vault.modals.convert')}</div>}
        className="text-b1s"
      >
        {fromToken.symbol} → {toToken.symbol}
      </LabeledInlineContent>

      <LabeledInlineContent label={t('vault.modals.pendleFee')}>{readableFee}</LabeledInlineContent>

      <LabeledInlineContent label={t('vault.modals.minReceived')}>
        {readableMinReceived}
      </LabeledInlineContent>

      <LabeledInlineContent label={t('vault.modals.estReceived')}>
        {readableEstimatedReceived}
      </LabeledInlineContent>
    </div>
  );
};
