import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';

export const useIsOnMarketPage = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnMarketPage =
    currentRoutePath === routes.corePoolMarket.path ||
    currentRoutePath === routes.lidoMarket.path ||
    currentRoutePath === routes.isolatedPoolMarket.path;

  return isOnMarketPage;
};
