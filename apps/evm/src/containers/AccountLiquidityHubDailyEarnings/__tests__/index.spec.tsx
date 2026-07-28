import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import { AccountLiquidityHubDailyEarnings } from '..';

describe('AccountLiquidityHubDailyEarnings', () => {
  it('renders correctly', () => {
    const { container } = renderComponent(
      <AccountLiquidityHubDailyEarnings liquidityHubs={liquidityHubs} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when passing simulated liquidity hubs', () => {
    const { container } = renderComponent(
      <AccountLiquidityHubDailyEarnings
        liquidityHubs={liquidityHubs}
        simulatedLiquidityHubs={liquidityHubs}
      />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
