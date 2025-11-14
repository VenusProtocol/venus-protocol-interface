import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { AccountData } from '..';

describe('AccountData', () => {
  it('renders correctly', async () => {
    const { container } = renderComponent(<AccountData pool={poolData[0]} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when passing a simulated pool', async () => {
    const { container } = renderComponent(
      <AccountData pool={poolData[0]} simulatedPool={poolData[0]} />,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
