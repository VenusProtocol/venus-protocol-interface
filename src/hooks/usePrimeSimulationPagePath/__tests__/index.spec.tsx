import { matchPath, useLocation } from 'react-router';
import Vi from 'vitest';

import { renderHook } from 'testUtils/render';

import { routes } from 'constants/routing';

import { usePrimeSimulationPagePath } from '..';

vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useLocation: vi.fn(),
  matchPath: vi.fn(),
}));

describe('usePrimeSimulationPagePath', () => {
  beforeEach(() => {
    (matchPath as Vi.Mock).mockImplementation((a, b) => a === b);
  });

  it.each([
    { pathname: routes.account.path, expectedResult: routes.accountPrimeSimulator.path },
    { pathname: routes.vaults.path, expectedResult: routes.vaultsPrimeSimulator.path },
    { pathname: '/fake/path', expectedResult: routes.dashboardPrimeSimulator.path },
  ])(
    'should return the right path based on the current location %s',
    ({ pathname, expectedResult }) => {
      (useLocation as Vi.Mock).mockImplementation(() => ({ pathname }));

      const { result } = renderHook(() => usePrimeSimulationPagePath());

      expect(result.current).toBe(expectedResult);
    },
  );
});
