import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHub } from 'clients/api';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { Route } from 'react-router';
import { renderComponent } from 'testUtils/render';
import LiquidityHub from '..';

const liquidityHub = liquidityHubs[0];

const renderLiquidityHub = () =>
  renderComponent(<LiquidityHub />, {
    routePath: routes.liquidityHub.path,
    routerInitialEntries: [
      routes.liquidityHub.path.replace(':vhTokenAddress', liquidityHub.vhToken.address),
    ],
  });

describe('LiquidityHub', () => {
  const mockUseGetLiquidityHub = useGetLiquidityHub as Mock;
  const mockUseIsFeatureEnabled = useIsFeatureEnabled as Mock;

  beforeEach(() => {
    mockUseGetLiquidityHub.mockReturnValue({
      data: {
        liquidityHub,
      },
      isLoading: false,
    });
    mockUseIsFeatureEnabled.mockReturnValue(false);
  });

  it('loads the liquidity hub from the route and renders its content', () => {
    renderLiquidityHub();

    expect(mockUseGetLiquidityHub).toHaveBeenNthCalledWith(
      1,
      {
        vhTokenAddress: liquidityHub.vhToken.address,
      },
      {
        enabled: true,
      },
    );
    expect(screen.getByText(en.market.supplyInfo.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Position unit price (${liquidityHub.vhToken.symbol})`),
    ).toBeInTheDocument();
    expect(screen.getByText('1.06')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTabTitle,
      }),
    ).toBeInTheDocument();
  });

  it('renders a spinner while the liquidity hub is loading', () => {
    mockUseGetLiquidityHub.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderLiquidityHub();

    expect(screen.getByAltText('Spinner')).toBeInTheDocument();
    expect(screen.queryByText(en.market.supplyInfo.title)).not.toBeInTheDocument();
  });

  it('redirects to the liquidity hubs page when the route address is invalid', async () => {
    mockUseGetLiquidityHub.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    const liquidityHubsPageTitle = 'Liquidity hubs page';

    renderComponent(<LiquidityHub />, {
      routePath: routes.liquidityHub.path,
      routerInitialEntries: [
        routes.liquidityHub.path.replace(':vhTokenAddress', liquidityHub.vhToken.address),
      ],
      otherRoutes: (
        <Route path={routes.liquidityHubs.path} element={<div>{liquidityHubsPageTitle}</div>} />
      ),
    });

    expect(await screen.findByText(liquidityHubsPageTitle)).toBeInTheDocument();
  });
});
