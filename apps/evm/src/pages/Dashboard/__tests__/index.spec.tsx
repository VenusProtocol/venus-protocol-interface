import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPools } from 'clients/api';

import Dashboard from '..';
import TEST_IDS from '../testIds';

describe('Dashboard', () => {
  beforeEach(() => {
    (useGetPools as Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Dashboard />);
  });

  it('displays markets table correctly', async () => {
    const { getByTestId } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.marketTable));
    const marketsTable = getByTestId(TEST_IDS.marketTable);
    expect(marketsTable.textContent).toMatchSnapshot();
  });

  it('displays wallet balance column in table when wallet is connected', async () => {
    const { getByTestId } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => getByTestId(TEST_IDS.marketTable));
    const marketsTable = getByTestId(TEST_IDS.marketTable);
    expect(marketsTable.textContent).toMatchSnapshot();
  });
});
