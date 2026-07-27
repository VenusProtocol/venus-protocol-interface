import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHub } from 'clients/api';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
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
    const { container } = renderLiquidityHub();

    expect(container.textContent).toMatchSnapshot();
  });
});
