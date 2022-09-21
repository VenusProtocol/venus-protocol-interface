import Path from 'constants/path';

import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    href: Path.ROOT,
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: Path.ACCOUNT,
    // Translation key: do not remove this comment
    // t('layout.menuItems.account')
    i18nKey: 'layout.menuItems.account',
    icon: 'person',
  },

  {
    href: Path.MARKETS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.markets')
    i18nKey: 'layout.menuItems.markets',
    icon: 'market',
  },
  {
    href: Path.VAULTS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.vaults')
    i18nKey: 'layout.menuItems.vaults',
    icon: 'vault',
  },
  {
    href: Path.HISTORY,
    // Translation key: do not remove this comment
    // t('layout.menuItems.history')
    i18nKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: Path.GOVERNANCE,
    // Translation key: do not remove this comment
    // t('layout.menuItems.governance')
    i18nKey: 'layout.menuItems.governance',
    icon: 'vote',
  },
  {
    href: Path.XVS,
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvs')
    i18nKey: 'layout.menuItems.xvs',
    icon: 'xvsOutlined',
  },
  {
    href: Path.CONVERT_VRT,
    // Translation key: do not remove this comment
    // t('layout.menuItems.convertVrt')
    // t('layout.menuItems.convertVrtTitle')
    i18nKey: 'layout.menuItems.convertVrt',
    icon: 'convert',
  },
  {
    href: Path.VAI,
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
