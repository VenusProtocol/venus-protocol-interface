import { IconName } from '../Icon';

export interface MenuItem {
  href: string;
  icon: IconName;
  i18nKey: string;
  isNew?: boolean;
}
