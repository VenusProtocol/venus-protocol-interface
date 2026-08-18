import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import type { Mock } from 'vitest';

import { UrlChainIdFallback } from 'App/UrlChainIdFallback';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId } from 'libs/wallet';
import { defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import AppRoutes from '..';

vi.mock('containers/Layout', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  const { Outlet } = await vi.importActual<typeof import('react-router')>('react-router');

  return {
    Layout: () => React.createElement('div', null, React.createElement(Outlet)),
  };
});

vi.mock('pages/Landing', () => ({ default: () => <div>Landing page</div> }));
vi.mock('pages/Dashboard', () => ({ default: () => <div>Dashboard page</div> }));

const unsupportedChainId = 999999999;
// Route of a page that has been removed from the dApp
const removedPageRoute = '/isolated-pools';

const LocationDisplay = () => {
  const { pathname, search } = useLocation();

  return (
    <>
      <div data-testid="pathname">{pathname}</div>

      <div data-testid="search">{search}</div>
    </>
  );
};

// Mirrors how the app renders these components
const renderApp = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />

      <UrlChainIdFallback />

      <LocationDisplay />
    </MemoryRouter>,
  );

describe('AppRoutes with an unsupported chain ID', () => {
  beforeEach(() => {
    (useChainId as Mock).mockImplementation(() => ({ chainId: defaultChain.id }));
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
  });

  it('redirects to the landing page when the route does not exist', async () => {
    renderApp(`${removedPageRoute}?${CHAIN_ID_SEARCH_PARAM}=${unsupportedChainId}`);

    expect(await screen.findByText('Landing page')).toBeInTheDocument();

    // routes.landing.path is "/", so the pathname is matched exactly to make sure the user is
    // not left on the route that does not exist anymore
    await waitFor(() =>
      expect(screen.getByTestId('pathname')).toHaveTextContent(
        new RegExp(`^${routes.landing.path}$`),
      ),
    );
  });

  it('stays on the current page and falls back to the default chain when the route exists', async () => {
    renderApp(`${routes.dashboard.path}?${CHAIN_ID_SEARCH_PARAM}=${unsupportedChainId}`);

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId('search')).toHaveTextContent(
        `?${CHAIN_ID_SEARCH_PARAM}=${defaultChain.id}`,
      ),
    );
    expect(screen.getByTestId('pathname')).toHaveTextContent(
      new RegExp(`^${routes.dashboard.path}$`),
    );
  });
});
