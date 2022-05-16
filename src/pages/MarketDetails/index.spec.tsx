import React from 'react';
import { createMemoryHistory } from 'history';

import renderComponent from 'testUtils/renderComponent';
import MarketDetails from '.';

describe('pages/MarketDetails', () => {
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
