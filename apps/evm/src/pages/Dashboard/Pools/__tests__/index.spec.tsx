import { poolData as fakePools } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { Pools } from '..';

describe('Pools', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Pools pools={fakePools} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when there are no pools to display', async () => {
    const { container } = renderComponent(<Pools pools={[]} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
