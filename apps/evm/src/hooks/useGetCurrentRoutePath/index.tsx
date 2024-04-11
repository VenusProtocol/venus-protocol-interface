import { matchRoutes, useLocation } from 'react-router';
import { routes } from 'constants/routing';
import { useMemo } from 'react';

const formattedRoutes = Object.values(routes).map(route => ({ path: route.path }));

export const useGetCurrentRoutePath = () => {
  const location = useLocation();

  return useMemo(() => {
    const matchingRoutes = matchRoutes(formattedRoutes, location);
    return matchingRoutes?.[0].route.path;
  }, [location]);
};
