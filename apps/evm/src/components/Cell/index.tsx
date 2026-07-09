import { cn } from '@venusprotocol/ui';

import { InfoIcon } from 'components/InfoIcon';

export type CellVariant = 'primary' | 'secondary';

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number | React.ReactNode;
  variant?: CellVariant;
  label?: string;
  tooltip?: string | React.ReactNode;
}

export const Cell: React.FC<CellProps> = ({
  className,
  tooltip,
  label,
  value,
  variant = 'primary',
  ...otherProps
}) => (
  <div className={cn('flex flex-col gap-y-1 whitespace-nowrap', className)} {...otherProps}>
    {!!label && (
      <div className="flex items-center">
        <span className={cn('text-grey', variant === 'primary' ? 'text-b1r' : 'text-p3r')}>
          {label}
        </span>

        {!!tooltip && <InfoIcon tooltip={tooltip} className="ml-2" />}
      </div>
    )}

    <p className="text-p2s">{value}</p>
  </div>
);
