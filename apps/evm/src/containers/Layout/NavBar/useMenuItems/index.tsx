import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { useGetPools } from 'clients/api';
// import { VENUS_FLUX_URL } from 'constants/production';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import type { MenuItem, SubMenu } from '../types';
// import venusCoreIconSrc from './venusCoreIcon.png';
// import venusFluxIconSrc from './venusFluxIcon.png';

export const useMenuItems = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const bridgeRouteEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const { marketsPagePath } = useGetMarketsPagePath();
  const { data: getPoolsData } = useGetPools();
  const pools = getPoolsData?.pools || [];

  const menu: Array<MenuItem | SubMenu> = [
    {
      to: routes.dashboard.path,
      label: t('layout.menu.dashboard.label'),
    },
  ];

  menu.push(
    {
      label: t('layout.menu.markets.label'),
      to: marketsPagePath,
      // variant: 'secondary',
      // items: [
      //   {
      //     to: marketsPagePath,
      //     imgSrc: venusCoreIconSrc,
      //     label: t('layouts.menu.markets.venusCore.label'),
      //     description: t('layouts.menu.markets.venusCore.description'),
      //   },
      //   {
      //     href: VENUS_FLUX_URL,
      //     imgSrc: venusFluxIconSrc,
      //     label: t('layouts.menu.markets.venusFlux.label'),
      //     description: t('layouts.menu.markets.venusFlux.description'),
      //   },
      // ],
    },
    {
      to: routes.staking.path,
      label: t('layout.menu.staking.label'),
    },
  );

  const othersSubMenuItems: MenuItem[] = [
    {
      to: routes.governance.path,
      iconName: 'market',
      label: t('layout.menu.others.governance.label'),
      description: t('layout.menu.others.governance.description'),
    },
  ];

  if (vaiRouteEnabled) {
    othersSubMenuItems.push({
      to: routes.vai.path,
      iconName: 'vaiOutline',
      label: t('layout.menu.others.vai.label'),
      description: t('layout.menu.others.vai.description'),
    });
  }

  if (bridgeRouteEnabled) {
    othersSubMenuItems.push({
      to: routes.bridge.path,
      iconName: 'bridge',
      label: t('layout.menu.others.bridge.label'),
      description: t('layout.menu.others.bridge.description'),
    });
  }

  if (accountAddress) {
    othersSubMenuItems.push({
      to: routes.port.path,
      iconName: 'download',
      label: t('layout.menu.others.port.label'),
      description: t('layout.menu.others.port.description'),
    });
  }

  if (swapRouteEnabled) {
    menu.push({
      to: routes.swap.path,
      iconName: 'convert',
      label: t('layout.menu.others.swap.label'),
    });
  }

  if (pools.length > 1) {
    othersSubMenuItems.push({
      to: routes.isolatedPools.path,
      iconName: 'fourDots',
      label: t('layout.menu.others.isolatedPools.label'),
      description: t('layout.menu.others.isolatedPools.description'),
    });
  }

  menu.push({
    label: t('layout.menu.others.label'),
    items: othersSubMenuItems,
  });

  return menu;
};
