import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { vhXvs } from '__mocks__/models/vhTokens';
import { useGetLiquidityHub } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import type { VhToken } from 'types';

import LiquidityHubAccessor from '..';

describe('LiquidityHubAccessor', () => {
  beforeEach(() => {
    (useGetLiquidityHub as Mock).mockImplementation(() => ({
      data: {
        liquidityHub: liquidityHubs[0],
      },
      isLoading: false,
    }));
  });

  it('renders children with the matching liquidity hub', () => {
    const children = vi.fn(({ liquidityHub }: { liquidityHub: (typeof liquidityHubs)[number] }) => (
      <div>{liquidityHub.operatorName}</div>
    ));

    renderComponent(<LiquidityHubAccessor vhToken={vhXvs}>{children}</LiquidityHubAccessor>);

    expect(screen.getByText(liquidityHubs[0].operatorName)).toBeInTheDocument();
    expect(children).toHaveBeenCalledWith({
      liquidityHub: liquidityHubs[0],
    });

    expect(useGetLiquidityHub).toHaveBeenCalledWith({
      vhTokenAddress: vhXvs.address,
    });
  });

  it('renders the spinner when no matching liquidity hub is found', () => {
    (useGetLiquidityHub as Mock).mockImplementation(() => ({
      data: {
        liquidityHub: undefined,
      },
      isLoading: false,
    }));

    const children = vi.fn();
    const unmatchedToken: VhToken = {
      ...vhXvs,
      address: '0x2000000000000000000000000000000000000099',
    };

    renderComponent(
      <LiquidityHubAccessor vhToken={unmatchedToken}>{children}</LiquidityHubAccessor>,
    );

    expect(screen.getByAltText('Spinner')).toBeInTheDocument();
    expect(children).not.toHaveBeenCalled();
  });
});
