import { screen } from '@testing-library/react';
import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { Header } from '..';
import { usePathNodes } from '../usePathNodes';

vi.mock('hooks/useGetCurrentRoutePath');
vi.mock('../usePathNodes');
vi.mock('../Breadcrumbs', () => ({
  Breadcrumbs: ({ pathNodes }: { pathNodes: Array<{ href: string }> }) => (
    <div data-testid="breadcrumbs">{pathNodes.map(pathNode => pathNode.href).join(',')}</div>
  ),
}));
vi.mock('../AssetInfo', () => ({
  AssetInfo: () => <div data-testid="asset-info" />,
}));
vi.mock('../LiquidityHubInfo', () => ({
  LiquidityHubInfo: () => <div data-testid="liquidity-hub-info" />,
}));

describe('Header', () => {
  beforeEach(() => {
    (useGetCurrentRoutePath as Mock).mockReturnValue(routes.dashboard.path);
    (usePathNodes as Mock).mockReturnValue([{ dom: 'Dashboard', href: '/dashboard' }]);
  });

  it('renders nothing when there is only one path node and the user is not on a market page', () => {
    const { container } = renderComponent(<Header />);

    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumbs when there is more than one path node', () => {
    (usePathNodes as Mock).mockReturnValue([
      { dom: 'Dashboard', href: '/dashboard' },
      { dom: 'Market', href: '/market' },
    ]);

    renderComponent(<Header />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('/dashboard,/market');
  });

  it('renders market info on market pages', () => {
    const vTokenAddress = '0x1111111111111111111111111111111111111111';

    (useGetCurrentRoutePath as Mock).mockReturnValue(routes.market.path);

    renderComponent(<Header />, {
      routePath: '/asset/:vTokenAddress',
      routerInitialEntries: [`/asset/${vTokenAddress}`],
    });

    expect(screen.getByTestId('asset-info')).toBeVisible();
  });

  it('renders liquidity hub info on liquidity hub pages', () => {
    const vhTokenAddress = '0x2222222222222222222222222222222222222222';

    (useGetCurrentRoutePath as Mock).mockReturnValue(routes.liquidityHub.path);
    (usePathNodes as Mock).mockReturnValue([
      { dom: 'Liquidity Hubs', href: '/liquidity-hubs' },
      { dom: 'Liquidity Hub', href: `/liquidity-hubs/${vhTokenAddress}` },
    ]);

    renderComponent(<Header />, {
      routePath: '/liquidity-hubs/:vhTokenAddress',
      routerInitialEntries: [`/liquidity-hubs/${vhTokenAddress}`],
    });

    expect(screen.getByTestId('liquidity-hub-info')).toBeVisible();
  });
});
