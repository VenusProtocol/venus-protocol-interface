import { cn } from '@venusprotocol/ui';

import type { SubMenu } from '../../types';
import { SubMenuItem, type SubMenuItemProps } from './SubMenuItem';

export interface SubMenuContentProps extends Omit<SubMenu, 'items'> {
  items: SubMenuItemProps[];
}

export const SubMenuContent: React.FC<SubMenuContentProps> = ({ variant = 'primary', items }) => (
  <div
    className={cn(
      'rounded-lg',
      variant === 'primary' && 'min-w-83',
      variant === 'secondary' && 'p-3 border border-white/12 lg:border-0 lg:w-75',
    )}
  >
    <div
      className={cn(
        variant === 'secondary' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-1' : 'space-y-3',
      )}
    >
      {items.map(subItem => (
        <SubMenuItem {...subItem} variant={variant} key={subItem.label} />
      ))}
    </div>
  </div>
);
