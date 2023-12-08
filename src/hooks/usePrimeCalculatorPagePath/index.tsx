import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';

import { routes } from 'constants/routing';

export const usePrimeCalculatorPagePath = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    if (matchPath(routes.account.path, pathname)) {
      return routes.accountPrimeCalculator.path;
    }

    if (matchPath(routes.vaults.path, pathname)) {
      return routes.vaultsPrimeCalculator.path;
    }

    return routes.dashboardPrimeCalculator.path;
  }, [pathname]);
};
