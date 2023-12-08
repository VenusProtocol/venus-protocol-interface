import { matchPath, useLocation } from 'react-router';
import Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { routes } from 'constants/routing';

import { usePrimeCalculatorPagePath } from '..';

vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useLocation: vi.fn(),
  matchPath: vi.fn(),
}));

describe('usePrimeCalculatorPagePath', () => {
  beforeEach(() => {
    (matchPath as Vi.Mock).mockImplementation((a, b) => a === b);
  });

  it.each([
    { pathname: routes.account.path, expectedResult: routes.accountPrimeCalculator.path },
    { pathname: routes.vaults.path, expectedResult: routes.vaultsPrimeCalculator.path },
    { pathname: '/fake/path', expectedResult: routes.dashboardPrimeCalculator.path },
  ])(
    'should return the right path based on the current location %s',
    ({ pathname, expectedResult }) => {
      (useLocation as Vi.Mock).mockImplementation(() => ({ pathname }));

      const { result } = renderHook(() => usePrimeCalculatorPagePath());

      expect(result.current).toBe(expectedResult);
    },
  );
});
