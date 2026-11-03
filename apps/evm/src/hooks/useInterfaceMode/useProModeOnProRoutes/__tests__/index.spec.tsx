import { act } from '@testing-library/react';

import { routes } from 'constants/routing';
import { renderHook } from 'testUtils/render';

import { useProModeOnProRoutes } from '..';
import { useStore } from '../../store';

describe('useProModeOnProRoutes', () => {
  beforeEach(() => {
    act(() => useStore.getState().setMode('lite'));
  });

  it.each(['/', routes.dashboard.path])('keeps Lite on %s', pathname => {
    renderHook(() => useProModeOnProRoutes(), {
      routerInitialEntries: [pathname],
      routePath: '*',
    });

    expect(useStore.getState().mode).toBe('lite');
  });

  it.each([routes.primeLeaderboard.path, '/markets/0x94d1820b2D1c7c7452A163983Dc888CEC546b77D'])(
    'switches to Pro on %s',
    pathname => {
      renderHook(() => useProModeOnProRoutes(), {
        routerInitialEntries: [pathname],
        routePath: '*',
      });

      expect(useStore.getState().mode).toBe('pro');
    },
  );
});
