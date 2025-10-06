import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';

export interface CellProp {
  label: string;
  isAvailable: boolean;
  className?: string;
}

export const Cell: React.FC<CellProp> = ({ label, isAvailable, className }) => (
  <div
    className={cn(
      'flex items-center gap-x-1 flex-1 justify-center p-2 sm:p-0 sm:flex-none',
      isAvailable ? 'text-green' : 'text-grey',
      className,
    )}
  >
    <Icon name={isAvailable ? 'mark' : 'close'} className="w-5 h-5 text-inherit" />

    <span className="text-sm">{label}</span>
  </div>
);
