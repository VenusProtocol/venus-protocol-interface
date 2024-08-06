import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';

export const useIsOnLidoMarketPage = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnLidoMarketPage = currentRoutePath === routes.lidoMarket.path;

  return isOnLidoMarketPage;
};
