import React from 'react';
import { IconName } from '../Icon';

interface IMenuItem {
  href: string;
  text: string;
  icon: IconName;
}

export const menuItems: IMenuItem[] = [
  {
    href: '/dashboard',
    text: 'Dashboard',
    icon: 'dashboard',
  },
  {
    href: '/vote',
    text: 'Vote',
    icon: 'vote',
  },
  {
    href: '/xvs',
    text: 'XVS',
    icon: 'xvsOutlined',
  },
  {
    href: '/market',
    text: 'Market',
    icon: 'market',
  },
  {
    href: '/vault',
    text: 'Vault',
    icon: 'vault',
  },
  {
    href: '/transaction',
    text: 'History',
    icon: 'history',
  },
  {
    href: 'https://prdt.finance/XVS',
    text: 'XVS Prediction',
    icon: 'market',
  },
];

if (process.env.REACT_APP_CHAIN_ID === '97') {
  menuItems.splice(6, 0, {
    href: '/convert-vrt',
    text: 'Convert XVS',
    icon: 'convert',
  });
}
