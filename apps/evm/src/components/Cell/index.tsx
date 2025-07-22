import { cn } from '@venusprotocol/ui';

import { InfoIcon } from 'components';

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number | React.ReactNode;
  small?: boolean;
  tooltip?: string;
}

export const Cell: React.FC<CellProps> = ({
  className,
  tooltip,
  label,
  value,
  small = false,
  ...otherProps
}) => (
  <div className={cn('flex flex-col gap-y-1 whitespace-nowrap', className)} {...otherProps}>
    <div className="flex items-center">
      <span className={cn('text-grey', small && 'text-sm')}>{label}</span>

      {!!tooltip && <InfoIcon tooltip={tooltip} className="ml-2" />}
    </div>

    <p className={cn(small ? 'text-lg' : 'text-xl')}>{value}</p>
  </div>
);
