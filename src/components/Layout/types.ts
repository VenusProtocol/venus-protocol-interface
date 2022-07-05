import { IconName } from '../Icon';

export interface Page {
  href: string;
  i18nTitleKey: string;
  showHeaderBackButton?: boolean;
}

export interface IMenuItem extends Page {
  i18nKey: string;
  icon: IconName;
  i18nKey: string;
  i18nTitleKey: string;
}
