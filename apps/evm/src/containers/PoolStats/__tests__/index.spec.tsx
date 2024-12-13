import { waitFor } from '@testing-library/dom';
import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
import { renderComponent } from 'testUtils/render';
import type Vi from 'vitest';
import { PoolStats } from '..';

vi.mock('hooks/useGetVTreasuryContractAddress');

describe('PoolStats', () => {
  beforeEach(() => {
    (useGetVTreasuryContractAddress as Vi.Mock).mockReturnValue(fakeAddress);
  });

  it('renders without crashing', async () => {
    renderComponent(<PoolStats pools={[]} stats={[]} />);
  });

  it('renders stats correctly', async () => {
    const { baseElement } = renderComponent(
      <PoolStats
        pools={poolData}
        stats={['supply', 'borrow', 'liquidity', 'treasury', 'assetCount', 'dailyXvsDistribution']}
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
