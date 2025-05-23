import { matchPath, useLocation } from 'react-router';
import type { Mock } from 'vitest';

import { renderHook } from 'testUtils/render';

import { routes } from 'constants/routing';

import { usePrimeCalculatorPagePath } from '..';

vi.mock(import('react-router'), async importOriginal => {
  const actual = await importOriginal();

  return {
    ...actual,
    useLocation: vi.fn(),
    matchPath: vi.fn(),
  };
});

describe('usePrimeCalculatorPagePath', () => {
  beforeEach(() => {
    (matchPath as Mock).mockImplementation((a, b) => a === b);
  });

  it.each([
    { pathname: routes.account.path, expectedResult: routes.accountPrimeCalculator.path },
    { pathname: routes.vaults.path, expectedResult: routes.vaultsPrimeCalculator.path },
    { pathname: '/fake/path', expectedResult: routes.dashboardPrimeCalculator.path },
  ])(
    'should return the right path based on the current location %s',
    ({ pathname, expectedResult }) => {
      (useLocation as Mock).mockImplementation(() => ({ pathname }));

      const { result } = renderHook(() => usePrimeCalculatorPagePath());

      expect(result.current).toBe(expectedResult);
    },
  );
});
