import { matchRoutes } from 'react-router';
import type Vi from 'vitest';

import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from '..';
import { renderHook } from 'testUtils/render';

vi.mock('react-router');

describe('useGetCurrentRoutePath', () => {
  it('returns first matching route path', () => {
    (matchRoutes as Vi.Mock).mockImplementation(() => [
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
    (matchRoutes as Vi.Mock).mockImplementation(() => null);

    const { result } = renderHook(() => useGetCurrentRoutePath());

    expect(result.current).toEqual(undefined);
  });
});
