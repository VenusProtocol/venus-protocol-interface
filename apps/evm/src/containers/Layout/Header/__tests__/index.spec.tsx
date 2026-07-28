import { screen } from '@testing-library/react';
import { useGetAsset } from 'clients/api';
import { routes } from 'constants/routing';
import { useGetCurrentRoutePath } from 'hooks/useGetCurrentRoutePath';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { Header } from '..';
import { usePathNodes } from '../usePathNodes';

vi.mock('hooks/useGetCurrentRoutePath');
vi.mock('hooks/useImageAccentColor');
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
    (useGetAsset as Mock).mockReturnValue({ data: undefined });
    (useImageAccentColor as Mock).mockReturnValue({ color: undefined });
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

  it('renders market info and applies the accent color on market pages', () => {
    const vTokenAddress = '0x1111111111111111111111111111111111111111';
    const gradientAccentColor = 'rgb(12, 34, 56)';

    (useGetCurrentRoutePath as Mock).mockReturnValue(routes.market.path);
    (useGetAsset as Mock).mockReturnValue({
      data: {
        asset: {
          vToken: {
            underlyingToken: {
              iconSrc: '/token.svg',
            },
          },
        },
      },
    });
    (useImageAccentColor as Mock).mockReturnValue({
      color: gradientAccentColor,
    });

    renderComponent(<Header />, {
      routePath: '/asset/:vTokenAddress',
      routerInitialEntries: [`/asset/${vTokenAddress}`],
    });

    expect(useGetAsset).toHaveBeenCalledWith({
      vTokenAddress,
    });
    expect(useImageAccentColor).toHaveBeenCalledWith({
      imagePath: '/token.svg',
    });
    expect(screen.getByRole('banner')).toHaveStyle({
      backgroundColor: gradientAccentColor,
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
