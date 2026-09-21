import type { IconName } from 'components';

export interface MenuItem {
  label: string;
  to?: string;
  href?: string;
  imgSrc?: string;
  iconName?: IconName;
  description?: string;
  tagLabel?: string;
  onClick?: () => void;
}

export interface SubMenu {
  label: string;
  items: MenuItem[];
  variant?: 'primary' | 'secondary';
  defaultOpenOnMobile?: boolean;
  tagLabel?: string;
}
