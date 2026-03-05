import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

export interface HealthFactorBadgeProps {
  value: number;
  className?: string;
}

export const HealthFactorBadge: React.FC<HealthFactorBadgeProps> = ({ value, className }) => {
  const { t } = useTranslation();

  const isSafe = value >= 1.5;
  const isWarning = value >= 1.1 && value < 1.5;

  const valueColorClass = isSafe ? 'text-green' : isWarning ? 'text-orange' : 'text-red';

  const badgeColorClass = isSafe
    ? 'bg-green/10 text-green border-green/20'
    : isWarning
      ? 'bg-orange/10 text-orange border-orange/20'
      : 'bg-red/10 text-red border-red/20';

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-b1r text-grey">{t('yieldPlus.positionForm.healthFactor.label')}</span>

      <div className="flex items-center gap-2">
        <span className={cn('text-b1s', valueColorClass)}>{value.toFixed(2)}</span>

        {isSafe && (
          <span className={cn('text-b2s px-2 py-0.5 rounded-full border text-xs', badgeColorClass)}>
            {t('yieldPlus.positionForm.healthFactor.safe')}
          </span>
        )}
      </div>
    </div>
  );
};
