import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { AssetInfo } from './AssetInfo';
import { Breadcrumbs } from './Breadcrumbs';
import { LiquidityHubInfo } from './LiquidityHubInfo';
import { SpokeMarketInfo } from './SpokeMarketInfo';
import { usePathNodes } from './usePathNodes';

export const Header: React.FC = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnMarketPage = currentRoutePath === routes.market.path;
  const isOnLiquidityHubPage = currentRoutePath === routes.liquidityHub.path;
  const isOnSpokeMarketPage = currentRoutePath === routes.spokeMarket.path;

  const pathNodes = usePathNodes();

  if (pathNodes.length <= 1 && !isOnMarketPage) {
    return undefined;
  }

  return (
    <header className="relative shrink-0">
      <div className="space-y-4 sm:space-y-6">
        {pathNodes.length > 1 && <Breadcrumbs pathNodes={pathNodes} className="pt-6 sm:pt-10" />}

        {isOnMarketPage && <AssetInfo />}

        {isOnLiquidityHubPage && <LiquidityHubInfo />}

        {isOnSpokeMarketPage && <SpokeMarketInfo />}
      </div>
    </header>
  );
};
