import { IconName } from 'components';

export interface MenuItem {
  href: string;
  icon: IconName;
  i18nKey: string;
  isNew?: boolean;
}
