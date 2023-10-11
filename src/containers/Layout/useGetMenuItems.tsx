import { useMemo } from 'react';

import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { MenuItem } from './types';

const useGetMenuItems = () => {
  const { accountAddress } = useAuth();

  return useMemo(() => {
    const menuItems: MenuItem[] = [
      {
        to: routes.dashboard.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.dashboard')
        i18nKey: 'layout.menuItems.dashboard',
        iconName: 'dashboard',
      },
    ];

    // Insert account page if wallet is connected
    if (accountAddress) {
      menuItems.push({
        to: routes.account.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.account')
        i18nKey: 'layout.menuItems.account',
        iconName: 'person',
      });
    }

    menuItems.push(
      {
        to: routes.corePool.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.corePool')
        i18nKey: 'layout.menuItems.corePool',
        iconName: 'venus',
      },
      {
        to: routes.isolatedPools.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.isolatedPools')
        i18nKey: 'layout.menuItems.isolatedPools',
        iconName: 'fourDots',
      },
      {
        to: routes.vaults.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.vaults')
        i18nKey: 'layout.menuItems.vaults',
        iconName: 'vault',
      },
      {
        to: routes.swap.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.swap')
        i18nKey: 'layout.menuItems.swap',
        iconName: 'convert',
      },
      {
        to: routes.history.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.history')
        i18nKey: 'layout.menuItems.history',
        iconName: 'history',
      },
      {
        to: routes.governance.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.governance')
        i18nKey: 'layout.menuItems.governance',
        iconName: 'market',
      },
      {
        to: routes.xvs.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.xvs')
        i18nKey: 'layout.menuItems.xvs',
        iconName: 'circledVenus',
      },
      {
        to: routes.vai.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.vai')
        i18nKey: 'layout.menuItems.vai',
        iconName: 'vaiOutline',
      },
      {
        to: routes.convertVrt.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.convertVrt')
        // t('layout.menuItems.convertVrtTitle')
        i18nKey: 'layout.menuItems.convertVrt',
        iconName: 'convert',
      },
    );

    return menuItems;
  }, [accountAddress]);
};

export default useGetMenuItems;
