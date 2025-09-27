import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';

export interface EModeIconProps {
  className?: string;
}

export const EModeIcon: React.FC<EModeIconProps> = ({ className }) => (
  <div
    className={cn(
      'w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]',
      className,
    )}
  >
    <Icon name="lightning2" className="text-cards w-[70%]" />
  </div>
);
