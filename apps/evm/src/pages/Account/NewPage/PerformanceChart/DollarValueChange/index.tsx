import { cn, formatCentsToReadableValue } from '@venusprotocol/ui';

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
        value !== undefined && value >= 0 && 'text-green',
        value !== undefined && value < 0 && 'text-red',
      )}
    >
      {value !== undefined && value > 0 && '+'}
      {readableValue}
    </span>
  );
};
