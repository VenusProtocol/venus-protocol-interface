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
      variant === 'secondary' && 'py-3 bg-background-active sm:min-w-79',
    )}
  >
    <div className="space-y-3">
      {items.map(subItem => (
        <SubMenuItem {...subItem} variant={variant} key={subItem.label} />
      ))}
    </div>
  </div>
);
