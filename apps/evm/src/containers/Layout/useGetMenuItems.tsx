import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import type { MenuItem } from './types';

const useGetMenuItems = () => {
  const { accountAddress } = useAccountAddress();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const bridgeRouteEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const { importablePositionsCount } = useGetProfitableImports();

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

    menuItems.push({
      to: routes.port.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.port')
      i18nKey: 'layout.menuItems.port',
      iconName: 'download',
      badgeNumber: importablePositionsCount || undefined,
      isNew: true,
    });
  }

  menuItems.push({
    to: routes.pools.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.pools')
    i18nKey: 'layout.menuItems.pools',
    iconName: 'fourDots',
  });

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

  menuItems.push({
    to: routes.governance.path,
    // Translation key: do not remove this comment
    // t('layout.menuItems.governance')
    i18nKey: 'layout.menuItems.governance',
    iconName: 'market',
  });

  if (vaiRouteEnabled) {
    menuItems.push({
      to: routes.vai.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.vai')
      i18nKey: 'layout.menuItems.vai',
      iconName: 'vaiOutline',
    });
  }

  if (bridgeRouteEnabled) {
    menuItems.push({
      to: routes.bridge.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.bridge')
      i18nKey: 'layout.menuItems.bridge',
      iconName: 'bridge',
    });
  }

  return menuItems;
};

export default useGetMenuItems;
