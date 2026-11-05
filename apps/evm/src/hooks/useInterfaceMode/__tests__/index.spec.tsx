import { act } from '@testing-library/react';

import { routes } from 'constants/routing';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';

import { useInterfaceMode } from '..';
import { useStore } from '../store';

vi.unmock('hooks/useIsFeatureEnabled');

const renderAt = (pathname: string, chainId = ChainId.BSC_TESTNET) =>
  renderHook(() => useInterfaceMode(), {
    chainId,
    routerInitialEntries: [pathname],
    routePath: '*',
  });

describe('useInterfaceMode', () => {
  beforeEach(() => {
    act(() => useStore.getState().setMode('lite'));
  });

  it.each([ChainId.BSC_MAINNET, ChainId.BSC_TESTNET])('keeps Lite on chain %s', chainId => {
    const { result } = renderAt('/', chainId);

    expect(result.current).toMatchObject({ mode: 'lite', isLite: true });
  });

  it.each([ChainId.ETHEREUM, ChainId.SEPOLIA, ChainId.ARBITRUM_ONE, ChainId.OPBNB_MAINNET])(
    'shows Pro on chain %s without changing the saved mode',
    chainId => {
      const { result } = renderAt('/', chainId);

      expect(result.current).toMatchObject({ mode: 'pro', isLite: false });
      expect(useStore.getState().mode).toBe('lite');
    },
  );

  it.each([
    '/',
    routes.dashboard.path,
    `${routes.dashboard.path}/`,
    routes.termsOfUse.path,
    routes.privacyPolicy.path,
    routes.skills.path,
  ])('follows the saved mode on %s', pathname => {
    expect(renderAt(pathname).result.current.mode).toBe('lite');

    act(() => useStore.getState().setMode('pro'));

    expect(renderAt(pathname).result.current.mode).toBe('pro');
  });

  it.each([routes.primeLeaderboard.path, '/markets/0x94d1820b2D1c7c7452A163983Dc888CEC546b77D'])(
    'shows Pro on %s without changing the saved mode',
    pathname => {
      const { result } = renderAt(pathname);

      expect(result.current).toMatchObject({ mode: 'pro', isLite: false });
      expect(useStore.getState().mode).toBe('lite');
    },
  );
});
