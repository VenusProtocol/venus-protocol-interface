import React from 'react';
import { createMemoryHistory } from 'history';

import renderComponent from 'testUtils/renderComponent';
import MarketDetails from '.';

const fakeVTokenId = 'aave';

jest.mock('clients/api');

describe('pages/MarketDetails', () => {
  beforeEach(() => {
    (getMarketHistory as jest.Mock).mockImplementation(() => marketSnapshots);
    (getMarkets as jest.Mock).mockImplementation(() => markets);
  });

  it('renders without crashing', () => {
    const fakeHistory = createMemoryHistory();
    renderComponent(
      <MarketDetails
        history={fakeHistory}
        location="/"
        match={{
          params: {
            vTokenId: 'aave',
          },
          isExact: true,
          path: '/:vTokenId',
          url: '',
        }}
      />,
    );
  });
});
