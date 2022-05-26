import React from 'react';
import { createMemoryHistory } from 'history';
import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { markets } from '__mocks__/models/markets';
import { marketSnapshots } from '__mocks__/models/marketSnapshots';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { getMarkets, getMarketHistory, getVTokenApySimulations } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import MarketDetails from '.';

const fakeVTokenId = 'aave';

jest.mock('clients/api');

describe('pages/MarketDetails', () => {
  beforeEach(() => {
    (getMarketHistory as jest.Mock).mockImplementation(() => marketSnapshots);
    (getMarkets as jest.Mock).mockImplementation(() => ({
      markets,
      dailyVenus: new BigNumber(0),
    }));
    (getVTokenApySimulations as jest.Mock).mockImplementation(() => vTokenApySimulations);
  });

  it('renders without crashing', () => {
    const fakeHistory = createMemoryHistory();
    renderComponent(
      <MarketDetails
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenId: fakeVTokenId,
          },
          isExact: true,
          path: '/:vTokenId',
          url: '',
        }}
      />,
    );
  });

  it('fetches market details and displays them correctly', async () => {
    const fakeHistory = createMemoryHistory();
    const { getByTestId } = renderComponent(
      <MarketDetails
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenId: fakeVTokenId,
          },
          isExact: true,
          path: '/:vTokenId',
          url: '',
        }}
      />,
    );

    // Check supply info displays correctly
    await waitFor(() => expect(getByTestId('market-details-supply-info')).toMatchSnapshot());
    // Check borrow info displays correctly
    expect(getByTestId('market-details-borrow-info')).toMatchSnapshot();
    // Check interest rate model displays correctly
    expect(getByTestId('market-details-interest-rate-model')).toMatchSnapshot();
    // Check market info displays correctly
    expect(getByTestId('market-details-market-info')).toMatchSnapshot();
  });
});
