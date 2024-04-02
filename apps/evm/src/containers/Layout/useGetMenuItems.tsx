import { useMemo } from 'react';

import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import type { MenuItem } from './types';

const useGetMenuItems = () => {
  const { accountAddress } = useAccountAddress();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const historyRouteEnabled = useIsFeatureEnabled({ name: 'historyRoute' });
  const convertVrtRouteEnabled = useIsFeatureEnabled({ name: 'convertVrtRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const xvsRouteEnabled = useIsFeatureEnabled({ name: 'xvsRoute' });
  const bridgeRouteEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const isolatedPoolsRouteEnabled = useIsFeatureEnabled({ name: 'isolatedPools' });

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

    menuItems.push({
      to: routes.corePool.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.corePool')
      i18nKey: 'layout.menuItems.corePool',
      iconName: 'venus',
    });

    if (isolatedPoolsRouteEnabled) {
      menuItems.push({
        to: routes.isolatedPools.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.isolatedPools')
        i18nKey: 'layout.menuItems.isolatedPools',
        iconName: 'fourDots',
      });
    }

    menuItems.push({
      to: routes.vaults.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.vaults')
      i18nKey: 'layout.menuItems.vaults',
      iconName: 'vault',
    });

    if (swapRouteEnabled) {
      menuItems.push({
        to: routes.swap.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.swap')
        i18nKey: 'layout.menuItems.swap',
        iconName: 'convert',
      });
    }

    if (historyRouteEnabled) {
      menuItems.push({
        to: routes.history.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.history')
        i18nKey: 'layout.menuItems.history',
        iconName: 'history',
      });
    }

    menuItems.push({
      to: routes.governance.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.governance')
      i18nKey: 'layout.menuItems.governance',
      iconName: 'market',
    });

    if (xvsRouteEnabled) {
      menuItems.push({
        to: routes.xvs.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.xvs')
        i18nKey: 'layout.menuItems.xvs',
        iconName: 'circledVenus',
      });
    }

    if (vaiRouteEnabled) {
      menuItems.push({
        to: routes.vai.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.vai')
        i18nKey: 'layout.menuItems.vai',
        iconName: 'vaiOutline',
      });
    }

    if (convertVrtRouteEnabled) {
      menuItems.push({
        to: routes.convertVrt.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.convertVrt')
        i18nKey: 'layout.menuItems.convertVrt',
        iconName: 'convert',
      });
    }

    if (bridgeRouteEnabled) {
      menuItems.push({
        to: routes.bridge.path,
        isNew: true,
        // Translation key: do not remove this comment
        // t('layout.menuItems.bridge')
        i18nKey: 'layout.menuItems.bridge',
        iconName: 'bridge',
      });
    }

    return menuItems;
  }, [
    accountAddress,
    convertVrtRouteEnabled,
    swapRouteEnabled,
    historyRouteEnabled,
    vaiRouteEnabled,
    xvsRouteEnabled,
    bridgeRouteEnabled,
    isolatedPoolsRouteEnabled,
  ]);
};

export default useGetMenuItems;
