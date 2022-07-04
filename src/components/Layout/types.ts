import { IconName } from '../Icon';

export interface IMenuItem {
  href: string;
  i18nKey: string;
  i18nTitleKey?: string;
  icon: IconName;
}
