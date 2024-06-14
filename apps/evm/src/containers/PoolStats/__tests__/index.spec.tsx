import { waitFor } from '@testing-library/dom';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import { PoolStats } from '..';

vi.mock('libs/contracts');

describe('PoolStats', () => {
  it('renders without crashing', async () => {
    renderComponent(<PoolStats pools={[]} stats={[]} />);
  });

  it('renders stats correctly', async () => {
    const { baseElement } = renderComponent(
      <PoolStats
        pools={poolData}
        stats={['supply', 'borrow', 'liquidity', 'treasury', 'assetCount']}
      />,
    );

    // Wait for all values to have loaded
    await waitFor(() => expect(baseElement.textContent!.includes('-')).toBeFalsy());

    expect(baseElement.textContent).toMatchSnapshot();
  });

  it('only displays the requested stats', async () => {
    const { baseElement } = renderComponent(
      <PoolStats pools={poolData} stats={['assetCount', 'supply', 'treasury']} />,
    );

    // Wait for all values to have loaded
    await waitFor(() => expect(baseElement.textContent!.includes('-')).toBeFalsy());

    expect(baseElement.textContent).toMatchSnapshot();
  });
});
