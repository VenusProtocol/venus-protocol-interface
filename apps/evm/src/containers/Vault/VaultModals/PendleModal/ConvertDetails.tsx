import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { PLACEHOLDER_KEY } from 'constants/placeholders';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

export interface ConvertDetailsProps {
  fromToken: Token;
  toToken: Token;
  slippagePercentage: number;
  estReceived?: string;
  className?: string;
}

export const ConvertDetails: React.FC<ConvertDetailsProps> = ({
  fromToken,
  toToken,
  slippagePercentage,
  estReceived,
  className,
}) => {
  const { t } = useTranslation();

  const estReceivedMantissa = estReceived ? new BigNumber(estReceived) : undefined;

  const minReceivedMantissa =
    estReceivedMantissa && slippagePercentage
      ? estReceivedMantissa.times(1 - slippagePercentage / 100)
      : undefined;

  return (
    <div className={cn('border border-lightGrey rounded-xl p-4 space-y-3', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-b1s text-white">{t('pendleModal.convert')}</span>
        <span className="text-b2r text-grey">
          {fromToken.symbol} → {toToken.symbol}
        </span>
      </div>

      {/* Pendle Fee */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('pendleModal.pendleFee')}</span>
        <span className="text-b2r text-white">{PLACEHOLDER_KEY}</span>
      </div>

      {/* Min. Received */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('pendleModal.minReceived')}</span>
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
        <span className="text-b2r text-grey">{t('pendleModal.estReceived')}</span>
        <span className="text-b2r text-white">
          ≈{' '}
          {estReceivedMantissa
            ? convertMantissaToTokens({
                value: estReceivedMantissa,
                token: toToken,
                returnInReadableFormat: true,
              })
            : PLACEHOLDER_KEY}
        </span>
      </div>
    </div>
  );
};

export default ConvertDetails;
