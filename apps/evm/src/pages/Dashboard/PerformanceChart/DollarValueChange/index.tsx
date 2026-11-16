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
        'text-base sm:text-lg',
        value !== undefined && value >= 0 && 'text-success',
        value !== undefined && value < 0 && 'text-danger',
      )}
    >
      {value !== undefined && value > 0 && '+'}
      {readableValue}
    </span>
  );
};
