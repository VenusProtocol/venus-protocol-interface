import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { useGetPools } from 'clients/api';
import { Icon, Tooltip, cn } from 'components';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useGetProfitableImports } from 'hooks/useGetProfitableImports';
import { useTranslation } from 'libs/translations';
import type { MenuItem } from './types';

const useGetMenuItems = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const bridgeRouteEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const { importablePositionsCount } = useGetProfitableImports();
  const { marketsPagePath } = useGetMarketsPagePath();
  const { data: getPoolsData } = useGetPools();
  const pools = getPoolsData?.pools || [];

  const menuItems: MenuItem[] = [
    {
      to: marketsPagePath,
      // Translation key: do not remove this comment
      // t('layout.menuItems.markets')
      i18nKey: 'layout.menuItems.markets',
      iconName: 'venus',
    },
  ];

  if (pools.length > 1) {
    menuItems.push({
      to: routes.isolatedPools.path,
      // Translation key: do not remove this comment
      // t('layout.menuItems.isolatedPools')
      i18nKey: 'layout.menuItems.isolatedPools',
      iconName: 'fourDots',
      suffixDom: (
        <Tooltip content={t('isolatedPoolsSunsetBanner.tooltip')} className="hidden xl:block">
          <Icon className={cn('h-4 w-4', 'text-orange')} name={'attention'} />
        </Tooltip>
      ),
    });
  }

  // Insert dashboard page if wallet is connected
  if (accountAddress) {
    menuItems.push(
      {
        to: routes.dashboard.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.dashboard')
        i18nKey: 'layout.menuItems.dashboard',
        iconName: 'person',
      },
      {
        to: routes.port.path,
        // Translation key: do not remove this comment
        // t('layout.menuItems.port')
        i18nKey: 'layout.menuItems.port',
        iconName: 'download',
        badgeNumber: importablePositionsCount || undefined,
      },
    );
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
