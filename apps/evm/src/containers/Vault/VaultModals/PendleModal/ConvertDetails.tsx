import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';

export interface ConvertDetailsProps {
  fromSymbol: string;
  toSymbol: string;
  fee?: string;
  minReceived?: string;
  estReceived?: string;
  className?: string;
}

export const ConvertDetails: React.FC<ConvertDetailsProps> = ({
  fromSymbol,
  toSymbol,
  fee,
  minReceived,
  estReceived,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('border border-lightGrey rounded-xl p-4 space-y-3', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-b1s text-white">{t('pendleModal.convert')}</span>
        <span className="text-b2r text-grey">
          {fromSymbol} → {toSymbol}
        </span>
      </div>

      {/* Pendle Fee */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('pendleModal.pendleFee')}</span>
        <span className="text-b2r text-white">{fee ?? '--'}</span>
      </div>

      {/* Min. Received */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('pendleModal.minReceived')}</span>
        <span className="text-b2r text-white">{minReceived ?? '--'}</span>
      </div>

      {/* Est. Received */}
      <div className="flex items-center justify-between">
        <span className="text-b2r text-grey">{t('pendleModal.estReceived')}</span>
        <span className="text-b2r text-white">≈ {estReceived ?? '--'}</span>
      </div>
    </div>
  );
};

export default ConvertDetails;
