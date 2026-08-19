import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router';
import type { Mock } from 'vitest';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { DISCORD_SERVER_URL } from 'constants/production';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import AppRoutes from '..';

const redirectMock = vi.hoisted(() =>
  vi.fn(({ to }: { to: string }) => <div data-testid="redirect">{to}</div>),
);

const pageMocks = vi.hoisted(() => ({
  Bridge: () => <div>Bridge page</div>,
  Dashboard: () => <div>Dashboard page</div>,
  FixedTermVaultTermsOfUse: () => <div>Fixed term vault terms page</div>,
  Governance: () => <div>Governance page</div>,
  Landing: () => <div>Landing page</div>,
  LiquidityHub: () => <div>Liquidity hub page</div>,
  LiquidityHubs: () => <div>Liquidity hubs page</div>,
  Market: () => <div>Market page</div>,
  Markets: () => <div>Markets page</div>,
  Port: () => <div>Port page</div>,
  PrimeCalculator: () => <div>Prime calculator page</div>,
  PrimeLeaderboard: () => <div>Prime leaderboard page</div>,
  PrivacyPolicy: () => <div>Privacy policy page</div>,
  Proposal: () => <div>Proposal page</div>,
  Skills: () => <div>Skills page</div>,
  Stats: () => <div>Stats page</div>,
  Swap: () => <div>Swap page</div>,
  TermsOfUse: () => <div>Terms of use page</div>,
  Trade: () => <div>Trade page</div>,
  Vai: () => <div>VAI page</div>,
  Vaults: () => <div>Vaults page</div>,
  Voter: () => <div>Voter page</div>,
  VoterLeaderboard: () => <div>Voter leaderboard page</div>,
}));

vi.mock('containers/Layout', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  const { Outlet } = await vi.importActual<typeof import('react-router')>('react-router');

  return {
    Layout: () =>
      React.createElement('div', { 'data-testid': 'layout' }, React.createElement(Outlet)),
  };
});

vi.mock('containers/Redirect', () => ({
  Redirect: redirectMock,
}));

vi.mock('pages/Bridge', () => ({ default: pageMocks.Bridge }));
vi.mock('pages/Dashboard', () => ({ default: pageMocks.Dashboard }));
vi.mock('pages/FixedTermVaultTermsOfUse', () => ({ default: pageMocks.FixedTermVaultTermsOfUse }));
vi.mock('pages/Governance', () => ({ default: pageMocks.Governance }));
vi.mock('pages/Landing', () => ({ default: pageMocks.Landing }));
vi.mock('pages/LiquidityHub', () => ({ default: pageMocks.LiquidityHub }));
vi.mock('pages/LiquidityHubs', () => ({ default: pageMocks.LiquidityHubs }));
vi.mock('pages/Market', () => ({ default: pageMocks.Market }));
vi.mock('pages/Markets', () => ({ default: pageMocks.Markets }));
vi.mock('pages/Port', () => ({ default: pageMocks.Port }));
vi.mock('pages/PrimeCalculator', () => ({ default: pageMocks.PrimeCalculator }));
vi.mock('pages/PrimeLeaderboard', () => ({ default: pageMocks.PrimeLeaderboard }));
vi.mock('pages/PrivacyPolicy', () => ({ default: pageMocks.PrivacyPolicy }));
vi.mock('pages/Proposal', () => ({ default: pageMocks.Proposal }));
vi.mock('pages/Skills', () => ({ default: pageMocks.Skills }));
vi.mock('pages/Stats', () => ({ default: pageMocks.Stats }));
vi.mock('pages/Swap', () => ({ default: pageMocks.Swap }));
vi.mock('pages/TermsOfUse', () => ({ default: pageMocks.TermsOfUse }));
vi.mock('pages/Trade', () => ({ default: pageMocks.Trade }));
vi.mock('pages/Vai', () => ({ default: pageMocks.Vai }));
vi.mock('pages/Vaults', () => ({ default: pageMocks.Vaults }));
vi.mock('pages/Voter', () => ({ default: pageMocks.Voter }));
vi.mock('pages/VoterLeaderboard', () => ({ default: pageMocks.VoterLeaderboard }));

const enabledFeatureNames = [
  'swapRoute',
  'vaiRoute',
  'bridgeRoute',
  'trade',
  'primeCalculator',
  'statsRoute',
  'primeLeaderboard',
  'liquidityHub',
];

const renderRoutes = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );

describe('AppRoutes', () => {
  beforeEach(() => {
    redirectMock.mockClear();
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) =>
      enabledFeatureNames.includes(name),
    );
  });

  it.each([
    ['/', 'Landing page'],
    [routes.dashboard.path, 'Dashboard page'],
    [routes.port.path, 'Port page'],
    ['/markets/0x0000000000000000000000000000000000000001', 'Markets page'],
    [
      '/markets/0x0000000000000000000000000000000000000001/0x0000000000000000000000000000000000000002',
      'Market page',
    ],
    [routes.governance.path, 'Governance page'],
    ['/governance/proposal/1', 'Proposal page'],
    ['/governance/leaderboard', 'Voter leaderboard page'],
    ['/governance/leaderboard/voter/0x0000000000000000000000000000000000000003', 'Voter page'],
    [routes.vaults.path, 'Vaults page'],
    [routes.skills.path, 'Skills page'],
    [routes.privacyPolicy.path, 'Privacy policy page'],
    [routes.termsOfUse.path, 'Terms of use page'],
    [routes.fixedTermVaultTermsOfUse.path, 'Fixed term vault terms page'],
  ])('renders %s', async (path, pageText) => {
    renderRoutes(path);

    expect(await screen.findByText(pageText)).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it.each([
    [routes.swap.path, 'Swap page'],
    [routes.vai.path, 'VAI page'],
    [routes.bridge.path, 'Bridge page'],
    [routes.trade.path, 'Trade page'],
    [routes.primeCalculator.path, 'Prime calculator page'],
    [routes.stats.path, 'Stats page'],
    [routes.primeLeaderboard.path, 'Prime leaderboard page'],
    [routes.liquidityHubs.path, 'Liquidity hubs page'],
    ['/liquidity-hubs/0x0000000000000000000000000000000000000004', 'Liquidity hub page'],
  ])('renders enabled feature route %s', async (path, pageText) => {
    renderRoutes(path);

    expect(await screen.findByText(pageText)).toBeInTheDocument();
  });

  it.each([
    [routes.swap.path, 'swapRoute'],
    [routes.vai.path, 'vaiRoute'],
    [routes.bridge.path, 'bridgeRoute'],
    [routes.trade.path, 'trade'],
    [routes.primeCalculator.path, 'primeCalculator'],
    [routes.stats.path, 'statsRoute'],
    [routes.primeLeaderboard.path, 'primeLeaderboard'],
    [routes.liquidityHubs.path, 'liquidityHub'],
  ])('falls back when %s is disabled', (path, disabledFeatureName) => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }) => enabledFeatureNames.includes(name) && name !== disabledFeatureName,
    );

    renderRoutes(path);

    expect(screen.getByTestId('redirect')).toHaveTextContent(routes.landing.path);
  });

  it.each([
    ['/account/history', routes.dashboard.path],
    ['/staking/xvs', routes.vaults.path],
    ['/pool/0x0000000000000000000000000000000000000001', routes.markets.path],
    [
      '/pool/0x0000000000000000000000000000000000000001/market/0x0000000000000000000000000000000000000002',
      '/markets/0x0000000000000000000000000000000000000001/0x0000000000000000000000000000000000000002',
    ],
    ['/missing', routes.landing.path],
  ])('redirects %s to %s', (path, redirectPath) => {
    renderRoutes(path);

    expect(screen.getByTestId('redirect')).toHaveTextContent(redirectPath);
  });

  it('scrolls the page container to the top on route change', async () => {
    const pageContainer = document.createElement('div');
    const scrollTo = vi.fn();
    pageContainer.id = PAGE_CONTAINER_ID;
    pageContainer.scrollTo = scrollTo;
    document.body.appendChild(pageContainer);

    render(
      <MemoryRouter initialEntries={[routes.dashboard.path]}>
        <Link to={routes.vaults.path}>Go to vaults</Link>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findByText('Dashboard page');
    fireEvent.click(screen.getByText('Go to vaults'));
    await screen.findByText('Vaults page');

    expect(scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    expect(scrollTo).toHaveBeenCalledTimes(2);

    pageContainer.remove();
  });

  it('redirects discord URLs to the Discord server', async () => {
    const originalLocation = window.location;
    const replace = vi.fn();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/discord',
        replace,
      },
    });

    renderRoutes('/discord');

    await waitFor(() => expect(replace).toHaveBeenCalledWith(DISCORD_SERVER_URL));

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });
});
