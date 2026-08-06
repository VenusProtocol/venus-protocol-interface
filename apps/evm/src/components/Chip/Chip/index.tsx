import { cn } from '@venusprotocol/ui';

import { Icon } from '../../Icon';
import type { ChipProps } from '../types';

export const Chip = ({ className, text, iconName, type = 'default' }: ChipProps) => (
  <div
    className={cn(
      'mr-2 inline-flex items-center rounded-lg py-1 text-sm font-normal',
      type === 'default' && 'bg-lightGrey px-2 text-white',
      type === 'active' && 'bg-green/10 px-3 text-green',
      type === 'inactive' && 'bg-grey/10 px-3 text-grey',
      type === 'blue' && 'bg-blue/10 px-3 text-blue',
      type === 'error' && 'bg-red/10 px-3 text-red',
      className,
    )}
  >
    {!!iconName && <Icon name={iconName} className="mr-1" />}

    <span>{text}</span>
  </div>
);
