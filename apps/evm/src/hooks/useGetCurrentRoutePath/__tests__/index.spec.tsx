import { matchRoutes } from 'react-router';
import type { Mock } from 'vitest';

import { routes } from 'constants/routing';
import { renderHook } from 'testUtils/render';
import { useGetCurrentRoutePath } from '..';

vi.mock('react-router');

describe('useGetCurrentRoutePath', () => {
  it('returns first matching route path', () => {
    (matchRoutes as Mock).mockImplementation(() => [
      {
        route: {
          path: routes.account.path,
        },
      },
    ]);

    const { result } = renderHook(() => useGetCurrentRoutePath());

    expect(result.current).toEqual(routes.account.path);
  });

  it('returns undefined if there is no matching route', () => {
    (matchRoutes as Mock).mockImplementation(() => null);

    const { result } = renderHook(() => useGetCurrentRoutePath());

    expect(result.current).toEqual(undefined);
  });
});
