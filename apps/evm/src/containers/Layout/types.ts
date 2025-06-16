import type { IconName } from 'components';

export interface MenuItem {
  to: string;
  iconName: IconName;
  i18nKey: string;
  badgeNumber?: number;
  isNew?: boolean;
}
