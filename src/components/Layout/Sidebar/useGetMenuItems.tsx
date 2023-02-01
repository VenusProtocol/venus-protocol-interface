import { useMemo } from 'react';

import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { MenuItem } from '../types';

const useGetMenuItems = () => {
  const { account, isReconnecting } = useAuth();

  return useMemo(() => {
    let menuItems: MenuItem[] = [
      {
        href: routes.dashboard.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.dashboard')
        i18nKey: 'layout.menuItems.dashboard',
        icon: 'dashboard',
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
        href: 'https://prdt.finance/Application/Pro/BSC?partnerCode=Venus',
        // Translation key: do not remove this comment
        // t('layout.menuItems.predictions')
        i18nKey: 'layout.menuItems.predictions',
        icon: 'predictions',
      },
    ];

    if (account || isReconnecting) {
      menuItems = [
        ...menuItems.slice(0, 1),
        {
          href: routes.account.path,
          // Translation key: do not remove this comment
          // t('layout.menuItems.account')
          i18nKey: 'layout.menuItems.account',
          icon: 'person',
        },
        ...menuItems.slice(1),
      ];
    }

    return menuItems;
  }, [account]);
};

export default useGetMenuItems;
