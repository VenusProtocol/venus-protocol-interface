import { fireEvent, waitFor } from '@testing-library/react';
import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';

import { useGetPools } from 'clients/api';
import { en } from 'libs/translations';

import Dashboard from '..';
import TEST_IDS from '../testIds';

describe('Dashboard', () => {
  beforeEach(() => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
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

  it('filters out assets when entering value in search input', async () => {
    const { getByTestId, queryAllByPlaceholderText } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.marketTable));

    // Enter value in search input
    fireEvent.change(queryAllByPlaceholderText(en.dashboard.searchInput.placeholder)[0], {
      target: { value: 'usdt' },
    });

    const supplyMarketTable = getByTestId(TEST_IDS.marketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });

  it('hides toggle to display paused assets when there are no paused assets', async () => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: poolData.map(pool => ({
          ...pool,
          assets: pool.assets.map(asset => ({
            ...asset,
            disabledTokenActions: [],
          })),
        })),
      },
      isLoading: false,
    }));

    const { getByTestId, queryByRole } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.marketTable));

    // Check toggle is hidden
    await waitFor(() => expect(queryByRole('checkbox')).not.toBeInTheDocument());
  });

  it('displays paused assets when switching the toggle', async () => {
    const { getByTestId, getByRole } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.marketTable));

    // Switch toggle
    const pausedAssetsToggle = getByRole('checkbox');
    fireEvent.click(pausedAssetsToggle);

    const supplyMarketTable = getByTestId(TEST_IDS.marketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });
});
