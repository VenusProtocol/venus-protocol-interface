import { routes } from 'constants/routing';

import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    href: routes.dashboard.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: routes.account.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.account')
    i18nKey: 'layout.menuItems.account',
    icon: 'person',
  },

  {
    href: routes.pools.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.pools')
    i18nKey: 'layout.menuItems.pools',
    icon: 'market',
  },
  {
    href: routes.vaults.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.vaults')
    i18nKey: 'layout.menuItems.vaults',
    icon: 'vault',
  },
  {
    href: routes.swap.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.swap')
    i18nKey: 'layout.menuItems.swap',
    icon: 'convert',
  },
  {
    href: routes.history.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.history')
    i18nKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: routes.governance.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.governance')
    i18nKey: 'layout.menuItems.governance',
    icon: 'vote',
  },
  {
    href: routes.xvs.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvs')
    i18nKey: 'layout.menuItems.xvs',
    icon: 'xvsOutlined',
  },
  {
    href: routes.convertVrt.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.convertVrt')
    // t('layout.menuItems.convertVrtTitle')
    i18nKey: 'layout.menuItems.convertVrt',
    icon: 'convert',
  },
  {
    href: routes.vai.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.vai')
    i18nKey: 'layout.menuItems.vai',
    icon: 'vaiOutline',
  },
  {
    href: 'https://prdt.finance/XVS',
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvsPrediction')
    i18nKey: 'layout.menuItems.xvsPrediction',
    icon: 'xvsPrediction',
  },
];
