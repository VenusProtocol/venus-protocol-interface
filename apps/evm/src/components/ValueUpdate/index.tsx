import { cn } from '@venusprotocol/ui';
import { Icon } from '../Icon';

export interface ValueUpdateProps extends React.HTMLAttributes<HTMLDivElement> {
  original: React.ReactNode;
  update?: React.ReactNode;
}

export const ValueUpdate: React.FC<ValueUpdateProps> = ({ className, original, update }) => (
  <div className={cn('flex items-center gap-x-2', className)}>
    {original}

    {update && (
      <>
        <Icon name="arrowShaft" className={cn('w-4 h-4 text-white')} />

        {update}
      </>
    )}
  </div>
);
