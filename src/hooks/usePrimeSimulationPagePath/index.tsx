import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';

import { routes } from 'constants/routing';

export const usePrimeSimulationPagePath = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (matchPath(routes.account.path, pathname)) {
      return routes.accountPrimeSimulator.path;
    }

    if (matchPath(routes.vaults.path, pathname)) {
      return routes.vaultsPrimeSimulator.path;
    }

    return routes.dashboardPrimeSimulator.path;
  }, [pathname]);
};
