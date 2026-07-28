import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { AccountPoolHealth } from '..';

describe('AccountPoolHealth', () => {
  it('renders correctly', async () => {
    const { container } = renderComponent(<AccountPoolHealth pool={poolData[0]} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when passing a simulated pool', async () => {
    const { container } = renderComponent(
      <AccountPoolHealth pool={poolData[0]} simulatedPool={poolData[0]} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
