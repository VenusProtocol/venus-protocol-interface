import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';

import { routes } from 'constants/routing';

export const usePrimeCalculatorPagePath = (input?: { tokenAddress: string }) => {
  const { pathname } = useLocation();

  const search = input?.tokenAddress ? `?tokenAddress=${input.tokenAddress}` : '';

  return useMemo(() => {
    if (matchPath(routes.account.path, pathname)) {
      return routes.accountPrimeCalculator.path + search;
    }

    if (matchPath(routes.vaults.path, pathname)) {
      return routes.vaultsPrimeCalculator.path + search;
    }

    return routes.dashboardPrimeCalculator.path + search;
  }, [pathname, search]);
};
