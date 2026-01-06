import { cn } from '@venusprotocol/ui';
import { Icon } from 'components';

export interface WarningProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'warning' | 'error';
}

export const Warning: React.FC<WarningProps> = ({ variant, ...otherProps }) => (
  <div
    className={cn(
      'w-4 h-4 rounded-full flex items-center justify-center absolute top-[-2px] right-[-2px] border-2 border-cards',
      variant === 'warning' ? 'bg-orange' : 'bg-red',
    )}
    {...otherProps}
  >
    <Icon name={variant === 'warning' ? 'exclamation' : 'close'} className="w-2 h-2 text-white" />
  </div>
);
