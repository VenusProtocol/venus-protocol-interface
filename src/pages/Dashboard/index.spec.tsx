import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetPools } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Dashboard from '.';
import TEST_IDS from './testIds';

vi.mock('clients/api');

describe('pages/Dashboard', () => {
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

  it('displays supply table correctly', async () => {
    const { getByTestId } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.supplyMarketTable));
    const supplyMarketTable = getByTestId(TEST_IDS.supplyMarketTable);
    expect(supplyMarketTable.textContent).toMatchSnapshot();
  });

  it('displays borrow table correctly', async () => {
    const { getByTestId } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.borrowMarketTable));
    const borrowMarketTable = getByTestId(TEST_IDS.borrowMarketTable);
    expect(borrowMarketTable.textContent).toMatchSnapshot();
  });

  it('displays supply table correctly', async () => {
    const { getByTestId } = renderComponent(<Dashboard />);

    await waitFor(() => getByTestId(TEST_IDS.supplyMarketTable));

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
