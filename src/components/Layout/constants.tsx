import { paths } from 'constants/routing';

import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    href: paths.dashboard,
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: paths.account,
    // Translation key: do not remove this comment
    // t('layout.menuItems.account')
    i18nKey: 'layout.menuItems.account',
    icon: 'person',
  },

  {
    href: paths.markets,
    // Translation key: do not remove this comment
    // t('layout.menuItems.markets')
    i18nKey: 'layout.menuItems.markets',
    icon: 'market',
  },
  {
    href: paths.vaults,
    // Translation key: do not remove this comment
    // t('layout.menuItems.vaults')
    i18nKey: 'layout.menuItems.vaults',
    icon: 'vault',
  },
  {
    href: paths.history,
    // Translation key: do not remove this comment
    // t('layout.menuItems.history')
    i18nKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: paths.governance,
    // Translation key: do not remove this comment
    // t('layout.menuItems.governance')
    i18nKey: 'layout.menuItems.governance',
    icon: 'vote',
  },
  {
    href: paths.xvs,
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvs')
    i18nKey: 'layout.menuItems.xvs',
    icon: 'xvsOutlined',
  },
  {
    href: paths.convertVrt,
    // Translation key: do not remove this comment
    // t('layout.menuItems.convertVrt')
    // t('layout.menuItems.convertVrtTitle')
    i18nKey: 'layout.menuItems.convertVrt',
    icon: 'convert',
  },
  {
    href: paths.vai,
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
