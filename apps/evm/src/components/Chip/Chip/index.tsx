import { cn } from '@venusprotocol/ui';

import { Icon } from '../../Icon';
import type { ChipProps } from '../types';

export const Chip = ({ className, text, iconName, type = 'default' }: ChipProps) => (
  <div
    className={cn(
      'mr-2 inline-flex items-center rounded-lg py-1 text-sm font-normal',
      type === 'default' && 'bg-neutral px-2 text-primary',
      type === 'active' && 'bg-success/10 px-3 text-success',
      type === 'inactive' && 'bg-neutral-bold/10 px-3 text-secondary',
      type === 'blue' && 'bg-brand/10 px-3 text-brand',
      type === 'error' && 'bg-danger/10 px-3 text-danger',
      className,
    )}
  >
    {!!iconName && <Icon name={iconName} className="mr-1" />}

    <span>{text}</span>
  </div>
);
