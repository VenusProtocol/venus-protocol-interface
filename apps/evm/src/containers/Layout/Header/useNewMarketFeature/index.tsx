import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export const useNewMarketFeature = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const isOnMarketPage =
    currentRoutePath === routes.corePoolMarket.path ||
    currentRoutePath === routes.stakedEthPoolMarket.path ||
    currentRoutePath === routes.isolatedPoolMarket.path;

  return isNewMarketPageEnabled && isOnMarketPage;
};
