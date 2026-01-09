import type { IconName } from 'components';

export interface MenuItem {
  label: string;
  to?: string;
  href?: string;
  imgSrc?: string;
  iconName?: IconName;
  description?: string;
}

export interface SubMenu {
  label: string;
  items: MenuItem[];
  variant?: 'primary' | 'secondary';
}
