import { screen } from '@testing-library/react';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { vhXvs } from '__mocks__/models/vhTokens';
import { renderComponent } from 'testUtils/render';
import type { VhToken } from 'types';

import LiquidityHubAccessor from '..';

describe('LiquidityHubAccessor', () => {
  it('renders children with the matching liquidity hub', () => {
    const children = vi.fn(({ liquidityHub }: { liquidityHub: (typeof liquidityHubs)[number] }) => (
      <div>{liquidityHub.operatorName}</div>
    ));

    renderComponent(<LiquidityHubAccessor vhToken={vhXvs}>{children}</LiquidityHubAccessor>);

    expect(screen.getByText(liquidityHubs[0].operatorName)).toBeInTheDocument();
    expect(children).toHaveBeenCalledWith({
      liquidityHub: liquidityHubs[0],
    });
  });

  it('matches liquidity hubs case-insensitively by token address', () => {
    const upperCasedToken: VhToken = {
      ...vhXvs,
      address: vhXvs.address.toUpperCase() as VhToken['address'],
    };

    renderComponent(
      <LiquidityHubAccessor vhToken={upperCasedToken}>
        {({ liquidityHub }) => <div>{liquidityHub.hubAddress}</div>}
      </LiquidityHubAccessor>,
    );

    expect(screen.getByText(liquidityHubs[0].hubAddress)).toBeInTheDocument();
  });

  it('renders the spinner when no matching liquidity hub is found', () => {
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
