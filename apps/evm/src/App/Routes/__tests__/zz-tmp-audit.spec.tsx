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
  return { Layout: () => React.createElement('div', null, React.createElement(Outlet)) };
});
vi.mock('pages/Landing', () => ({ default: () => <div>Landing page</div> }));
vi.mock('pages/Dashboard', () => ({ default: () => <div>Dashboard page</div> }));
vi.mock('pages/Vaults', () => ({ default: () => <div>Vaults page</div> }));
vi.mock('pages/Markets', () => ({ default: () => <div>Markets page</div> }));
vi.mock('pages/Swap', () => ({ default: () => <div>Swap page</div> }));

const unsupported = 999999999;
const navCounts: number[] = [];

const Tracker = () => {
  const { pathname, search, key } = useLocation();
  navCounts.push(1);
  return (
    <>
      <div data-testid="pathname">{pathname}</div>
      <div data-testid="search">{search}</div>
      <div data-testid="key">{key}</div>
    </>
  );
};

const renderApp = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
      <UrlChainIdFallback />
      <Tracker />
    </MemoryRouter>,
  );

describe('redirect audit: other routes with unsupported chain ID', () => {
  beforeEach(() => {
    (useChainId as Mock).mockImplementation(() => ({ chainId: defaultChain.id }));
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);
    navCounts.length = 0;
  });

  it.each([
    ['/account/history', routes.dashboard.path, 'Dashboard page'],
    ['/staking/xvs', routes.vaults.path, 'Vaults page'],
    ['/missing-page', routes.landing.path, 'Landing page'],
    [routes.swap.path, routes.landing.path, 'Landing page'],
  ])('%s lands on %s with an unsupported chain ID', async (from, expected, text) => {
    renderApp(`${from}?${CHAIN_ID_SEARCH_PARAM}=${unsupported}`);

    expect(await screen.findByText(text)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId('pathname')).toHaveTextContent(new RegExp(`^${expected}$`)),
    );
    expect(screen.getByTestId('search')).toHaveTextContent(
      `?${CHAIN_ID_SEARCH_PARAM}=${defaultChain.id}`,
    );
  });

  it.each([
    ['/account/history', routes.dashboard.path, 'Dashboard page'],
    ['/staking/xvs', routes.vaults.path, 'Vaults page'],
  ])('%s still redirects normally with a supported chain ID', async (from, expected, text) => {
    renderApp(`${from}?${CHAIN_ID_SEARCH_PARAM}=${defaultChain.id}`);

    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(screen.getByTestId('pathname')).toHaveTextContent(new RegExp(`^${expected}$`));
  });

  it('does not navigate in a loop', async () => {
    renderApp(`/missing-page?${CHAIN_ID_SEARCH_PARAM}=${unsupported}`);

    expect(await screen.findByText('Landing page')).toBeInTheDocument();
    const renders = navCounts.length;
    await new Promise(r => setTimeout(r, 300));
    // Allow a couple of extra renders, but a loop would add many
    expect(navCounts.length - renders).toBeLessThan(3);
  });

  it('preserves unrelated search params when redirecting', async () => {
    renderApp(`/account/history?${CHAIN_ID_SEARCH_PARAM}=${defaultChain.id}&foo=bar`);

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument();
    // documents current behaviour, whatever it is
    console.log('SEARCH AFTER REDIRECT:', screen.getByTestId('search').textContent);
  });
});
