import { cn } from '@venusprotocol/ui';

export interface LayeredValuesProps {
  topValue: string | number;
  bottomValue?: string | number;
  className?: string;
  bottomValueClassName?: string;
  topValueClassName?: string;
}

export const LayeredValues: React.FC<LayeredValuesProps> = ({
  topValue,
  bottomValue,
  className,
  topValueClassName,
  bottomValueClassName,
}) => (
  <div className={className}>
    <p className={topValueClassName}>{topValue}</p>
    {bottomValue && <p className={cn('text-grey', bottomValueClassName)}>{bottomValue}</p>}
  </div>
);

export default LayeredValues;
