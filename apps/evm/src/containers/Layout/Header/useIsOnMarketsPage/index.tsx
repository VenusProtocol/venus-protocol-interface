import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';

export const useIsOnMarketsPage = () => {
  const currentRoutePath = useGetCurrentRoutePath();
  const isOnMarketsPage = currentRoutePath === routes.markets.path;

  return isOnMarketsPage;
};
