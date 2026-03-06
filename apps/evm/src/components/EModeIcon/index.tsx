import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';

export interface EModeIconProps {
  isIsolated?: boolean;
  className?: string;
}

export const EModeIcon: React.FC<EModeIconProps> = ({ isIsolated = false, className }) => {
  if (isIsolated) {
    return <Icon name="isolated" className={cn('size-5', className)} />;
  }

  return (
    <div
      className={cn(
        'w-5 h-5 flex items-center justify-center rounded-full bg-linear-to-r from-[#00F5A0] to-[#00D9F5]',
        className,
      )}
    >
      <Icon name="lightning2" className="text-cards w-[70%]" />
    </div>
  );
};
