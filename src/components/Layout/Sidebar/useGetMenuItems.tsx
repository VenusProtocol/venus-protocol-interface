import { useMemo } from 'react';
import { isFeatureEnabled } from 'utilities';

import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { MenuItem } from '../types';

const useGetMenuItems = () => {
  const { accountAddress } = useAuth();

  return useMemo(() => {
    const menuItems: MenuItem[] = [
      {
        href: routes.dashboard.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.dashboard')
        i18nKey: 'layout.menuItems.dashboard',
        icon: 'dashboard',
      },
    ];

    // Insert account page if wallet is connected
    if (accountAddress) {
      menuItems.push({
        href: routes.account.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.account')
        i18nKey: 'layout.menuItems.account',
        icon: 'person',
      });
    }

    if (isFeatureEnabled('isolatedPools')) {
      menuItems.push(
        {
          href: routes.corePool.path,
          // Translation key: do not remove this comment
          // t('layout.menuItems.corePool')
          i18nKey: 'layout.menuItems.corePool',
          icon: 'venus',
        },
        {
          href: routes.isolatedPools.path,
          // Translation key: do not remove this comment
          // t('layout.menuItems.isolatedPools')
          i18nKey: 'layout.menuItems.isolatedPools',
          icon: 'fourDots',
        },
      );
    } else {
      menuItems.push({
        href: routes.corePool.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.markets')
        i18nKey: 'layout.menuItems.markets',
        icon: 'venus',
      });
    }

    menuItems.push(
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
        icon: 'market',
      },
      {
        href: routes.xvs.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.xvs')
        i18nKey: 'layout.menuItems.xvs',
        icon: 'circledVenus',
      },
      {
        href: routes.vai.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.vai')
        i18nKey: 'layout.menuItems.vai',
        icon: 'vaiOutline',
      },
      {
        href: routes.convertVrt.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.convertVrt')
        // t('layout.menuItems.convertVrtTitle')
        i18nKey: 'layout.menuItems.convertVrt',
        icon: 'convert',
      },
    );

    return menuItems;
  }, [accountAddress]);
};

export default useGetMenuItems;
