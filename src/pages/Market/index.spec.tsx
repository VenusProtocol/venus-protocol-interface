import { waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { marketSnapshots } from '__mocks__/models/marketSnapshots';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { getMainMarketHistory, getVTokenApySimulations, useGetAsset } from 'clients/api';
import { routes } from 'constants/routing';
import { VBEP_TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import Market from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

describe('pages/Market', () => {
  beforeEach(() => {
    (useGetAsset as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: assetData[0],
      },
    }));

    (getMainMarketHistory as jest.Mock).mockImplementation(() => ({
      marketSnapshots,
    }));

    (getVTokenApySimulations as jest.Mock).mockImplementation(() => ({
      apySimulations: vTokenApySimulations,
    }));
  });

  it('renders without crashing', () => {
    const fakeHistory = createMemoryHistory();
    renderComponent(
      <Market
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenAddress: VBEP_TOKENS.aave.address,
          },
          isExact: true,
          path: routes.market.path,
          url: '',
        }}
      />,
    );
  });

  it('fetches market details and displays them correctly', async () => {
    const fakeHistory = createMemoryHistory();
    const { getByTestId } = renderComponent(
      <Market
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenAddress: VBEP_TOKENS.aave.address,
          },
          isExact: true,
          path: routes.market.path,
          url: '',
        }}
      />,
    );

    // Check supply info displays correctly
    await waitFor(() => expect(getByTestId(TEST_IDS.supplyInfo).textContent).toMatchSnapshot());
    // Check borrow info displays correctly
    expect(getByTestId(TEST_IDS.borrowInfo).textContent).toMatchSnapshot();
    // Check interest rate model displays correctly
    expect(getByTestId(TEST_IDS.interestRateModel).textContent).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId(TEST_IDS.marketInfo).textContent).toMatchSnapshot();
  });
});
