import { cn } from '@venusprotocol/ui';
import type { GetPendleSwapQuoteOutput } from 'clients/api';
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

  return (
    <div className={cn('border border-lightGrey rounded-xl p-4 space-y-3', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-b1s text-white">{t('vault.modals.convert')}</span>
        <span className="text-b2r text-grey">
          {fromToken.symbol} → {toToken.symbol}
        </span>
      </div>

      {/* Pendle Fee */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('vault.modals.pendleFee')}</span>
        <span className="text-b2r text-white">
          {feeCents
            ? formatCentsToReadableValue({
                value: feeCents,
              })
            : PLACEHOLDER_KEY}
        </span>
      </div>

      {/* Min. Received */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('vault.modals.minReceived')}</span>
        <span className="text-b2r text-white">
          {minReceivedMantissa
            ? convertMantissaToTokens({
                value: minReceivedMantissa,
                token: toToken,
                returnInReadableFormat: true,
              })
            : PLACEHOLDER_KEY}
        </span>
      </div>

      {/* Est. Received */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('vault.modals.estReceived')}</span>
        <span className="text-b2r text-white">
          {estimatedReceivedTokensMantissa
            ? `≈ ${convertMantissaToTokens({
                value: estimatedReceivedTokensMantissa,
                token: toToken,
                returnInReadableFormat: true,
              })}`
            : PLACEHOLDER_KEY}
        </span>
      </div>
    </div>
  );
};
