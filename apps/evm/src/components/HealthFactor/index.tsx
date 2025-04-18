import { cn } from '@venusprotocol/ui';
import { useHealthFactor } from 'hooks/useHealthFactor';

export interface HealthFactorProps extends React.HTMLAttributes<HTMLDivElement> {
  factor: number;
  showLabel?: boolean;
}

export const HealthFactor: React.FC<HealthFactorProps> = ({
  factor,
  showLabel,
  className,
  ...otherProps
}) => {
  const { readableHealthFactor, bgClass, bgSemiTransparentClass, borderClass, label } =
    useHealthFactor({ value: factor });

  return (
    <div {...otherProps} className={cn('inline-flex items-center justify-center', className)}>
      <div
        className={cn(
          'flex items-center px-2 text-sm text-background font-semibold rounded-full h-5',
          bgClass,
        )}
      >
        {readableHealthFactor}
      </div>

      {showLabel && (
        <div
          className={cn(
            'pl-4 pr-2 -ml-3 text-xs font-[500] border border-l-0 rounded-r-full h-5 border-box',
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
