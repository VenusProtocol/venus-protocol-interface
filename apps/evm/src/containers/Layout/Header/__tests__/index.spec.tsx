import { screen } from '@testing-library/react';
import { useGetAsset } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useImageAccentColor } from 'hooks/useImageAccentColor';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { Header } from '..';
import { useIsOnMarketPage } from '../useIsOnMarketPage';
import { useIsOnMarketsPage } from '../useIsOnMarketsPage';
import { usePathNodes } from '../usePathNodes';

vi.mock('hooks/useImageAccentColor');
vi.mock('../useIsOnMarketPage');
vi.mock('../useIsOnMarketsPage');
vi.mock('../usePathNodes');
vi.mock('../Breadcrumbs', () => ({
  Breadcrumbs: ({ pathNodes }: { pathNodes: Array<{ href: string }> }) => (
    <div data-testid="breadcrumbs">{pathNodes.map(pathNode => pathNode.href).join(',')}</div>
  ),
}));
vi.mock('../MarketInfo', () => ({
  MarketInfo: () => <div data-testid="market-info" />,
}));

describe('Header', () => {
  beforeEach(() => {
    (useIsOnMarketPage as Mock).mockReturnValue(false);
    (useIsOnMarketsPage as Mock).mockReturnValue(false);
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

    (useIsOnMarketPage as Mock).mockReturnValue(true);
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
    expect(screen.getByTestId('market-info')).toBeVisible();
  });

  it('falls back to the null address when the route has no vTokenAddress param', () => {
    renderComponent(<Header />);

    expect(useGetAsset).toHaveBeenCalledWith({
      vTokenAddress: NULL_ADDRESS,
    });
  });
});
