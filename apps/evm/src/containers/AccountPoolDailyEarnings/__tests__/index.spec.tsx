import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { AccountPoolDailyEarnings } from '..';

describe('AccountPoolDailyEarnings', () => {
  it('renders correctly', () => {
    const { container } = renderComponent(<AccountPoolDailyEarnings pool={poolData[0]} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when passing a simulated pool', () => {
    const { container } = renderComponent(
      <AccountPoolDailyEarnings pool={poolData[0]} simulatedPool={poolData[0]} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
