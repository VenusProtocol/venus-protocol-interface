import { isOnTestnet } from 'config';
import { IMenuItem } from './types';

export const menuItems: IMenuItem[] = [
  {
    href: '/dashboard',
    // Translation key: do not remove this comment
    // t('layout.menuItems.dashboard')
    i18nKey: 'layout.menuItems.dashboard',
    icon: 'dashboard',
  },
  {
    href: '/vote',
    // Translation key: do not remove this comment
    // t('layout.menuItems.vote')
    i18nKey: 'layout.menuItems.vote',
    icon: 'vote',
  },
  {
    href: '/xvs',
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvs')
    i18nKey: 'layout.menuItems.xvs',
    icon: 'xvsOutlined',
  },
  {
    href: '/market',
    // Translation key: do not remove this comment
    // t('layout.menuItems.market')
    i18nKey: 'layout.menuItems.market',
    icon: 'market',
  },
  {
    href: '/vault',
    // Translation key: do not remove this comment
    // t('layout.menuItems.vault')
    i18nKey: 'layout.menuItems.vault',
    icon: 'vault',
  },
  {
    href: '/convert-vrt',
    // Translation key: do not remove this comment
    // t('layout.menuItems.convertVrt')
    // t('layout.menuItems.convertVrtTitle')
    i18nKey: 'layout.menuItems.convertVrt',
    i18nTitleKey: 'layout.menuItems.convertVrtTitle',
    icon: 'convert',
  },
  {
    href: '/transaction',
    // Translation key: do not remove this comment
    // t('layout.menuItems.history')
    i18nKey: 'layout.menuItems.history',
    icon: 'history',
  },
  {
    href: 'https://prdt.finance/XVS',
    // Translation key: do not remove this comment
    // t('layout.menuItems.xvsPrediction')
    i18nKey: 'layout.menuItems.xvsPrediction',
    icon: 'xvsPrediction',
  },
];

if (isOnTestnet) {
  menuItems.splice(menuItems.length, 0, {
    href: '/faucet',
    // Translation key: do not remove this comment
    // t('layout.menuItems.faucet')
    i18nKey: 'layout.menuItems.faucet',
    icon: 'faucet',
  });
}
