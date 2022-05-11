import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import MarketDetails from '.';

describe('pages/MarketDetails', () => {
  it('renders without crashing', () => {
    renderComponent(<MarketDetails />);
  });
});
