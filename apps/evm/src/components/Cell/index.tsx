import { cn } from '@venusprotocol/ui';

import { InfoIcon } from 'components/InfoIcon';

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number | React.ReactNode;
  label?: string;
  tooltip?: string;
}

export const Cell: React.FC<CellProps> = ({ className, tooltip, label, value, ...otherProps }) => (
  <div className={cn('flex flex-col gap-y-1 whitespace-nowrap', className)} {...otherProps}>
    {!!label && (
      <div className="flex items-center">
        <span className="text-grey text-sm">{label}</span>

        {!!tooltip && <InfoIcon tooltip={tooltip} className="ml-2" />}
      </div>
    )}

    <p className="text-b1s">{value}</p>
  </div>
);
