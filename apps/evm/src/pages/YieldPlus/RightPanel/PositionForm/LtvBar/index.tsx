import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

export interface LtvBarProps {
  ltvPercentage: number;
  liquidationThresholdPercentage: number;
  onChange: (value: number) => void;
  className?: string;
}

export const LtvBar: React.FC<LtvBarProps> = ({
  ltvPercentage,
  liquidationThresholdPercentage,
  className,
}) => {
  const { t } = useTranslation();

  const clampedLtv = Math.min(Math.max(ltvPercentage, 0), 100);
  const clampedLt = Math.min(Math.max(liquidationThresholdPercentage, 0), 100);

  const ltvColor =
    clampedLtv >= clampedLt * 0.9
      ? 'bg-red'
      : clampedLtv >= clampedLt * 0.7
        ? 'bg-orange'
        : 'bg-green';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex justify-between">
        <span className="text-b2r text-grey">
          {t('yieldPlus.positionForm.ltv', { value: `${clampedLtv.toFixed(2)}%` })}
        </span>
        <span className="text-b2r text-grey">
          {t('yieldPlus.positionForm.lt', { value: `${clampedLt.toFixed(2)}%` })}
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-lightGrey">
        <div
          className={cn('h-full rounded-full transition-all', ltvColor)}
          style={{ width: `${clampedLtv}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-red opacity-70"
          style={{ left: `${clampedLt}%` }}
        />
      </div>
    </div>
  );
};
