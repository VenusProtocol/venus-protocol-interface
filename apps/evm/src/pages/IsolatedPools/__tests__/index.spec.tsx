import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPools } from 'clients/api';
import { useMarketsPagePath } from 'hooks/useMarketsPagePath';
import { Route } from 'react-router';
import { renderComponent } from 'testUtils/render';
import Dashboard from '..';
import TEST_IDS from '../testIds';

vi.mock('hooks/useMarketsPagePath');

const FAKE_HOME_PAGE_PATH = '/home';

describe('Isolated Pools', () => {
  beforeEach(() => {
    (useGetPools as Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));

    (useMarketsPagePath as Mock).mockImplementation(() => ({
      marketsPagePath: FAKE_HOME_PAGE_PATH,
    }));
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

  it('redirects to home page when there is only the Core pool to display', async () => {
    (useGetPools as Mock).mockImplementation(() => ({
      data: {
        pools: [poolData[0]],
      },
      isLoading: false,
    }));

    const fakeHomePageTitle = 'Fake home page';

    const { container } = renderComponent(<Dashboard />, {
      accountAddress: fakeAccountAddress,
      otherRoutes: <Route path={FAKE_HOME_PAGE_PATH} element={<div>{fakeHomePageTitle}</div>} />,
    });

    expect(container.textContent).toContain(fakeHomePageTitle);
  });
});
