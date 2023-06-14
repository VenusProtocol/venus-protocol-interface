import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { useGetPools } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Dashboard from '.';
import TEST_IDS from './testIds';

vi.mock('clients/api');

describe('pages/Dashboard', () => {
  beforeEach(() => {
    (useGetPools as vi.Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Dashboard />);
  });

  it('displays supply table correctly', async () => {
    const { getByTestId } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.supplyMarketTable));
    const supplyMarketTable = getByTestId(TEST_IDS.supplyMarketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });

  it('displays borrow table when clicking on borrow tab and displays it correctly', async () => {
    const { getByTestId, getAllByText } = renderComponent(<Dashboard />);

    // Click on borrow tab
    fireEvent.click(getAllByText(en.dashboard.borrowTabTitle)[0]);

    await waitFor(() => getByTestId(TEST_IDS.borrowMarketTable));
    const borrowMarketTable = getByTestId(TEST_IDS.borrowMarketTable);
    expect(borrowMarketTable.textContent).toMatchSnapshot();
  });

  it('hides higher risk tokens when turning switch off', async () => {
    const { getByTestId, queryAllByRole } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.supplyMarketTable));

    // Turn switch off
    fireEvent.click(queryAllByRole('checkbox')[0]);

    const supplyMarketTable = getByTestId(TEST_IDS.supplyMarketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });

  it('filters out assets when entering value in search input', async () => {
    const { getByTestId, queryAllByPlaceholderText } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.supplyMarketTable));

    // Enter value in search input
    fireEvent.change(queryAllByPlaceholderText(en.dashboard.searchInput.placeholder)[0], {
      target: { value: 'usdt' },
    });

    const supplyMarketTable = getByTestId(TEST_IDS.supplyMarketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });

  // TODO: add tests for isolated pools feature flag
});
