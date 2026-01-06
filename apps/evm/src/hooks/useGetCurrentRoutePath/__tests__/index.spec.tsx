import { matchRoutes } from 'react-router';
import type { Mock } from 'vitest';

import { routes } from 'constants/routing';
import { renderHook } from 'testUtils/render';
import { useGetCurrentRoutePath } from '..';

vi.mock(import('react-router'), async importOriginal => {
  const actual = await importOriginal();

  return {
    ...actual,
    matchRoutes: vi.fn(),
  };
});

describe('useGetCurrentRoutePath', () => {
  it('returns first matching route path', () => {
    (matchRoutes as Mock).mockImplementation(() => [
      {
        route: {
          path: routes.dashboard.path,
        },
      },
    ]);

    const { result } = renderHook(() => useGetCurrentRoutePath());

    expect(result.current).toEqual(routes.dashboard.path);
  });

  it('returns undefined if there is no matching route', () => {
    (matchRoutes as Mock).mockImplementation(() => null);

    const { result } = renderHook(() => useGetCurrentRoutePath());

    expect(result.current).toEqual(undefined);
  });
});
