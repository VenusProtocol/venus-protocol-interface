import { cn } from '@venusprotocol/ui';
import { formatCentsToReadableValue } from 'utilities';

export interface DollarValueChangeProps {
  value?: number;
}

export const DollarValueChange: React.FC<DollarValueChangeProps> = ({ value }) => {
  const readableValue = formatCentsToReadableValue({
    value,
  });

  return (
    <span
      className={cn(
        value !== undefined && value >= 0 && 'text-green',
        value !== undefined && value < 0 && 'text-red',
      )}
    >
      {value !== undefined && value > 0 && '+'}
      {readableValue}
    </span>
  );
};
