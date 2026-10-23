import BigNumber from 'bignumber.js';

import { useGetLiquidityHubs } from 'clients/api';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';

import { VENUS_FLUX_URL } from 'constants/production';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { formatPercentageToReadableValue, getCombinedApy } from 'utilities';
import type { MenuItem, SubMenu } from '../types';

export const useDashboardMenuItem = (): MenuItem => {
  const { t } = useTranslation();

  return {
    to: routes.dashboard.path,
    label: t('layout.menu.dashboard.label'),
  };
};

export const useMenuItems = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();
  const swapRouteEnabled = useIsFeatureEnabled({ name: 'swapRoute' });
  const vaiRouteEnabled = useIsFeatureEnabled({ name: 'vaiRoute' });
  const bridgeRouteEnabled = useIsFeatureEnabled({ name: 'bridgeRoute' });
  const statsRouteEnabled = useIsFeatureEnabled({ name: 'statsRoute' });
  const tradeRouteEnabled = useIsFeatureEnabled({ name: 'trade' });
  const primeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const liquidityHubEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });
  const spokeEnabled = useIsFeatureEnabled({ name: 'spoke' });
  const { marketsPagePath } = useGetMarketsPagePath();

  const { data: getLiquidityHubsData } = useGetLiquidityHubs({ accountAddress });

  const liquidityHubMaxApyPercentage = (getLiquidityHubsData?.liquidityHubs ?? [])
    .filter(liquidityHub => !liquidityHub.isPaused)
    .reduce(
      (maxApyPercentage, liquidityHub) =>
        BigNumber.max(
          maxApyPercentage,
          getCombinedApy({
            type: 'supply',
            baseApyPercentage: liquidityHub.supplyApyPercentage,
            tokenDistributions: liquidityHub.supplyTokenDistributions,
          }).totalApyPercentage,
        ),
      new BigNumber(0),
    );

  const liquidityHubTagLabel = liquidityHubMaxApyPercentage.isGreaterThan(0)
    ? formatPercentageToReadableValue(liquidityHubMaxApyPercentage)
    : undefined;

  const menu: Array<MenuItem | SubMenu> = [];

  const borrowSubMenu: SubMenu = {
    label: t('layout.menu.borrow.label'),
    variant: 'secondary',
    items: [
      {
        to: marketsPagePath,
        menuIconName: 'core',
        label: t('layouts.menu.markets.venusCore.label'),
        description: t('layouts.menu.markets.venusCore.description'),
      },
    ],
  };

  if (spokeEnabled) {
    borrowSubMenu.items.push({
      to: routes.spokePools.path,
      menuIconName: 'spoke',
      label: t('layouts.menu.markets.venusSpoke.label'),
      tagLabel: t('layout.menu.new'),
      description: t('layouts.menu.markets.venusSpoke.description'),
    });
  }

  if (liquidityHubEnabled) {
    menu.push(
      {
        label: t('layout.menu.earn.label'),
        variant: 'secondary',
        tagLabel: liquidityHubTagLabel,
        items: [
          {
            to: routes.liquidityHubs.path,
            menuIconName: 'liquidityHub',
            label: t('layouts.menu.markets.liquidityHub.label'),
            tagLabel: liquidityHubTagLabel,
            description: t('layouts.menu.markets.liquidityHub.description'),
            onClick: () =>
              captureAnalyticEvent('hub_navigation', {
                variant: 'topbar_earn_dropdown',
              }),
          },
          {
            to: routes.vaults.path,
            menuIconName: 'vault',
            label: t('layouts.menu.markets.vaults.label'),
            description: t('layouts.menu.markets.vaults.description'),
          },
        ],
      },
      borrowSubMenu,
    );
  } else {
    menu.push(borrowSubMenu, {
      to: routes.vaults.path,
      label: t('layout.menu.vaults.label'),
    });
  }

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

  if (swapRouteEnabled) {
    othersSubMenuItems.push({
      to: routes.swap.path,
      iconName: 'convert',
      label: t('layout.menu.others.swap.label'),
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

  if (primeLeaderboardEnabled) {
    menu.push({
      to: routes.primeLeaderboard.path,
      label: t('layout.menu.prime.label'),
    });
  }

  if (statsRouteEnabled) {
    othersSubMenuItems.push({
      to: routes.stats.path,
      iconName: 'stats',
      label: t('layout.menu.others.stats.label'),
      description: t('layout.menu.others.stats.description'),
    });
  }

  if (tradeRouteEnabled) {
    othersSubMenuItems.push({
      to: routes.trade.path,
      iconName: 'trade',
      label: t('layout.menu.others.trade.label'),
      description: t('layout.menu.others.trade.description'),
      tagLabel: t('layout.menu.beta'),
    });
  }

  menu.push(
    {
      href: VENUS_FLUX_URL,
      label: t('layout.menu.flux.label'),
    },
    {
      label: t('layout.menu.others.label'),
      items: othersSubMenuItems,
    },
  );

  return menu;
};
