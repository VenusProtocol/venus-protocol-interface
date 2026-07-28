import { screen, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { legacyCorePool } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import type { BalanceMutation, LiquidityHub } from 'types';

import { BalanceUpdates } from '..';

const liquidityHub = liquidityHubs[0];

describe('BalanceUpdates', () => {
  it('renders asset and liquidity hub balance updates in mutation order', () => {
    const asset = legacyCorePool.assets[0];
    const balanceMutations: BalanceMutation[] = [
      {
        type: 'asset',
        action: 'withdraw',
        amountTokens: new BigNumber(2),
        vTokenAddress: asset.vToken.address,
        label: 'Core pool balance',
      },
      {
        type: 'liquidityHub',
        action: 'supply',
        amountTokens: new BigNumber(2),
        vhTokenAddress: liquidityHub.vhToken.address,
        label: 'Liquidity hub balance',
      },
    ];

    renderComponent(
      <BalanceUpdates
        pool={legacyCorePool}
        liquidityHubs={liquidityHubs}
        balanceMutations={balanceMutations}
      />,
    );

    const rows = screen.getAllByText(/balance$/).map(label => label.closest('.flex.w-full'));

    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Core pool balance');
    expect(rows[0]).toHaveTextContent('90');
    expect(rows[0]).toHaveTextContent('88');
    expect(rows[1]).toHaveTextContent('Liquidity hub balance');
    expect(rows[1]).toHaveTextContent('42');
    expect(rows[1]).toHaveTextContent('44');
  });

  it('matches liquidity hubs case-insensitively and renders mutation descriptions', () => {
    const balanceMutation: BalanceMutation = {
      type: 'liquidityHub',
      action: 'withdraw',
      amountTokens: new BigNumber(1),
      vhTokenAddress: liquidityHub.vhToken.address.toUpperCase() as `0x${string}`,
      description: 'Venus Liquidity Hub',
    };

    renderComponent(
      <BalanceUpdates liquidityHubs={liquidityHubs} balanceMutations={[balanceMutation]} />,
    );

    const row = screen.getByText('Venus Liquidity Hub').closest('.flex.w-full');

    expect(row).toHaveTextContent('Supply balance');
    expect(row).toHaveTextContent('42');
    expect(row).toHaveTextContent('41');
    expect(row?.parentElement).toHaveTextContent('- $7.15');
  });

  it('clamps liquidity hub withdrawals to zero', () => {
    const balanceMutation: BalanceMutation = {
      type: 'liquidityHub',
      action: 'withdraw',
      amountTokens: new BigNumber(100),
      vhTokenAddress: liquidityHub.vhToken.address,
      label: 'Liquidity hub balance',
    };

    renderComponent(
      <BalanceUpdates liquidityHubs={liquidityHubs} balanceMutations={[balanceMutation]} />,
    );

    const row = screen.getByText('Liquidity hub balance').closest('.flex.w-full');

    expect(row).toHaveTextContent('42');
    expect(row).toHaveTextContent('0');
    expect(row?.parentElement).toHaveTextContent('- $300.3');
  });

  it('skips unsupported mutations and liquidity hubs without a user balance', () => {
    const hubWithoutUserBalance: LiquidityHub = {
      ...liquidityHub,
      userSupplyBalanceTokens: undefined,
    };
    const balanceMutations: BalanceMutation[] = [
      {
        type: 'vai',
        action: 'borrow',
        amountTokens: new BigNumber(1),
      },
      {
        type: 'liquidityHub',
        action: 'supply',
        amountTokens: new BigNumber(1),
        vhTokenAddress: hubWithoutUserBalance.vhToken.address,
      },
    ];

    const { container } = renderComponent(
      <BalanceUpdates
        liquidityHubs={[hubWithoutUserBalance]}
        balanceMutations={balanceMutations}
      />,
    );

    expect(within(container).queryByText('Supply balance')).not.toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
