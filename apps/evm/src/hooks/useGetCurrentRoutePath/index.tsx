import { routes } from 'constants/routing';
import { matchRoutes, useLocation } from 'react-router';

const formattedRoutes = Object.values(routes).map(route => ({ path: route.path }));

export const useGetCurrentRoutePath = () => {
  const location = useLocation();

  const matchingRoutes = matchRoutes(formattedRoutes, location);
  return matchingRoutes?.[0].route.path || undefined;
};
