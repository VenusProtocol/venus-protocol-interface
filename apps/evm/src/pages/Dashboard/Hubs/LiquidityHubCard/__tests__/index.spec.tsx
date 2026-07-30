import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import { LiquidityHubCard } from '..';

vi.mock('containers/LiquidityHubFormModal', () => ({
  LiquidityHubFormModal: ({
    vhToken,
    handleClose,
  }: {
    vhToken: { symbol: string };
    handleClose: () => void;
  }) => (
    <div role="dialog">
      <p>Liquidity Hub form modal for {vhToken.symbol}</p>
      <button type="button" onClick={handleClose}>
        Close
      </button>
    </div>
  ),
}));

const liquidityHub = liquidityHubs[0];

const liquidityHubWithoutUserSupplyBalance = {
  ...liquidityHub,
  userSupplyBalanceTokens: new BigNumber(0),
  userSupplyBalanceCents: new BigNumber(0),
  userYearlyEarningsCents: new BigNumber(0),
};

describe('LiquidityHubCard', () => {
  it('displays user supply balance and daily earnings when the user has a position', () => {
    const { container } = renderComponent(
      <LiquidityHubCard liquidityHub={liquidityHub} to="/liquidity-hubs/xvs" />,
    );

    expect(container.textContent).toMatchSnapshot();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('opens liquidity hub form modal when clicking a card with a user position', () => {
    const { container } = renderComponent(<LiquidityHubCard liquidityHub={liquidityHub} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Currently supplied'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(container.textContent).toMatchSnapshot();
  });

  it('displays total supplied and links to the hub when the user has no position', () => {
    const { container } = renderComponent(
      <LiquidityHubCard
        liquidityHub={liquidityHubWithoutUserSupplyBalance}
        to="/liquidity-hubs/xvs"
      />,
    );

    expect(container.textContent).toMatchSnapshot();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('/liquidity-hubs/xvs?'),
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', expect.stringContaining('97'));
  });
});
