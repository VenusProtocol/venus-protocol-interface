import type { IconName } from 'components';
import type { ReactNode } from 'react';

export interface MenuItem {
  to: string;
  iconName: IconName;
  i18nKey: string;
  badgeNumber?: number;
  isNew?: boolean;
  suffixDom?: ReactNode;
}
