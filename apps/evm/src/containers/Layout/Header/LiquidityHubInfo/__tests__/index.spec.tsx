import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHub } from 'clients/api';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';
import { LiquidityHubInfo } from '..';

const fakeLiquidityHub = liquidityHubs[0];

vi.mock('hooks/responsive', async () => {
  const actual = await vi.importActual<typeof import('hooks/responsive')>('hooks/responsive');

  return {
    ...actual,
    useBreakpointUp: vi.fn(() => true),
  };
});

describe('LiquidityHubInfo', () => {
  beforeEach(() => {
    (useGetLiquidityHub as Mock).mockReturnValue({
      data: {
        liquidityHub: fakeLiquidityHub,
      },
    });
  });

  it('renders liquidity hub header cells with mocked hub data', () => {
    renderComponent(<LiquidityHubInfo />, {
      routePath: routes.liquidityHub.path,
      routerInitialEntries: [`/liquidity-hubs/${fakeLiquidityHub.vhToken.address}`],
    });

    expect(screen.getByText(fakeLiquidityHub.vhToken.underlyingToken.symbol)).toBeInTheDocument();
    expect(screen.getByText('Supply')).toBeInTheDocument();
    expect(screen.getByText('Liquidity')).toBeInTheDocument();
    expect(screen.getByText('Suppliers')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Exposures')).toBeInTheDocument();
    expect(screen.getByText(fakeLiquidityHub.supplierCount)).toBeInTheDocument();
  });
});
