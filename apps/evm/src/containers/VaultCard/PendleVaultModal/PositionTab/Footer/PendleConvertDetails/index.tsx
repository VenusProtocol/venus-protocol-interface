import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import type { GetPendleSwapQuoteOutput } from 'clients/api';
import { Icon, LabeledInlineContent } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface ConvertDetailsProps {
  fromToken: Token;
  isMatured: boolean;
  toToken: Token;
  userStakedTokens?: BigNumber;
  slippagePercentage: number;
  swapQuote?: GetPendleSwapQuoteOutput;
  className?: string;
}

export const PendleConvertDetails: React.FC<ConvertDetailsProps> = ({
  fromToken,
  isMatured,
  toToken,
  userStakedTokens,
  slippagePercentage,
  swapQuote,
  className,
}) => {
  const { t } = useTranslation();

  const minReceivedMantissa =
    swapQuote?.estimatedReceivedTokensMantissa && slippagePercentage
      ? swapQuote.estimatedReceivedTokensMantissa.times(1 - slippagePercentage / 100)
      : undefined;

  const readableFee = formatCentsToReadableValue({
    value: swapQuote?.feeCents,
  });

  const readableMinReceived = minReceivedMantissa
    ? convertMantissaToTokens({
        value: minReceivedMantissa,
        token: toToken,
        returnInReadableFormat: true,
      })
    : PLACEHOLDER_KEY;

  const readableEstimatedReceived = swapQuote?.estimatedReceivedTokensMantissa
    ? `≈ ${convertMantissaToTokens({
        value: swapQuote.estimatedReceivedTokensMantissa,
        token: toToken,
        returnInReadableFormat: true,
      })}`
    : PLACEHOLDER_KEY;

  const readableReceived = formatTokensToReadableValue({
    value: userStakedTokens,
    token: toToken,
  });

  return (
    <div className={cn('border border-lightGrey rounded-xl p-4 space-y-3', className)}>
      <LabeledInlineContent
        label={<div className="text-white">{t('vault.modals.convert')}</div>}
        className="text-b1s"
      >
        <div className="flex items-center gap-x-1">
          <span>{fromToken.symbol}</span>

          <Icon name="arrowShaft" className="text-white" />

          <span>{toToken.symbol}</span>
        </div>
      </LabeledInlineContent>

      {isMatured && (
        <LabeledInlineContent label={t('vault.modals.received')}>
          {readableReceived}
        </LabeledInlineContent>
      )}

      {!isMatured && (
        <>
          <LabeledInlineContent label={t('vault.modals.pendleFee')}>
            {readableFee}
          </LabeledInlineContent>

          <LabeledInlineContent label={t('vault.modals.minReceived')}>
            {readableMinReceived}
          </LabeledInlineContent>

          <LabeledInlineContent label={t('vault.modals.estReceived')}>
            {readableEstimatedReceived}
          </LabeledInlineContent>
        </>
      )}
    </div>
  );
};
