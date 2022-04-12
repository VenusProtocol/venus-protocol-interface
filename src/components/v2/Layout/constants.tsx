import { isOnTestnet } from 'config';
import { IconName } from '../Icon';

interface IMenuItem {
  href: string;
  /**
   * i18nKey are used for extracting texts from translation files
   *
   * avoid removing this values in order to save the content
   */
  i18nKey: string;
  icon: IconName;
}

export const menuItems: IMenuItem[] = [
  {
    href: '/dashboard',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: '/vote',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.vote',
    icon: 'vote',
  },
  {
    href: '/xvs',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.xvs',
    icon: 'xvsOutlined',
  },
  {
    href: '/market',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.market',
    icon: 'market',
  },
  {
    href: '/vault',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.vault',
    icon: 'vault',
  },
  {
    href: '/transaction',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: 'https://prdt.finance/XVS',
    // Translation key: do not remove this comment
    i18nKey: 'layout.menuItems.xvsPrediction',
    icon: 'market',
  },
];

if (isOnTestnet) {
  menuItems.splice(
    menuItems.length,
    0,
    {
      href: '/convert-vrt',
      // Translation key: do not remove this comment
      i18nKey: 'layout.menuItems.convertXvs',
      icon: 'convert',
    },
    {
      href: '/faucet',
      // Translation key: do not remove this comment
      i18nKey: 'layout.menuItems.faucet',
      icon: 'info',
    },
  );
}
