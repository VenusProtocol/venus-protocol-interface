import { useMemo } from 'react';
import { getContractAddress, isFeatureEnabled } from 'utilities';

import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { MenuItem } from '../types';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller');

const useGetMenuItems = () => {
  const { isConnected } = useAuth();

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
    if (isConnected) {
      menuItems.push({
        href: routes.account.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.account')
        i18nKey: 'layout.menuItems.account',
        icon: 'person',
      });
    }

    // Add Pools or Markets page depending on isolated pools feature flag
    menuItems.push(
      isFeatureEnabled('isolatedPools')
        ? {
            href: routes.pools.path,
            // Translation key: do not remove this comment
            // t('layout.menuItems.pools')
            i18nKey: 'layout.menuItems.pools',
            icon: 'market',
          }
        : {
            href: routes.markets.path.replace(
              ':poolComptrollerAddress',
              MAIN_POOL_COMPTROLLER_ADDRESS,
            ),
            // Translation key: do not remove this comment
            // t('layout.menuItems.markets')
            i18nKey: 'layout.menuItems.markets',
            icon: 'market',
          },
    );

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

      {
        href: 'https://prdt.finance/Application/Pro/BSC?partnerCode=Venus',
        // Translation key: do not remove this comment
        // t('layout.menuItems.predictions')
        i18nKey: 'layout.menuItems.predictions',
        icon: 'predictions',
      },
    );

    return menuItems;
  }, [isConnected]);
};

export default useGetMenuItems;
