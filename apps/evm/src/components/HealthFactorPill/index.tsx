import { cn } from '@venusprotocol/ui';
import { useHealthFactor } from 'hooks/useHealthFactor';
import { formatHealthFactorToReadableValue } from 'utilities';

export interface HealthFactorPillProps extends React.HTMLAttributes<HTMLDivElement> {
  factor: number;
  showLabel?: boolean;
}

export const HealthFactorPill: React.FC<HealthFactorPillProps> = ({
  factor,
  showLabel,
  className,
  ...otherProps
}) => {
  const { bgClass, bgSemiTransparentClass, borderClass, label } = useHealthFactor({
    value: factor,
  });

  return (
    <div {...otherProps} className={cn('inline-flex items-center justify-center', className)}>
      <div className={cn('flex items-center px-2 rounded-full h-[21px]', bgClass)}>
        <p className="text-background text-sm font-semibold">
          {formatHealthFactorToReadableValue({ value: factor })}
        </p>
      </div>

      {showLabel && (
        <div
          className={cn(
            'pl-4 pr-2 -ml-3 text-xs font-[500] border border-l-0 rounded-r-full border-box h-[21px]',
            bgSemiTransparentClass,
            borderClass,
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
};
