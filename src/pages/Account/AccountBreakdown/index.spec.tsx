import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import Account from '.';

describe('pages/Account', () => {
  it('renders without crashing', () => {
    renderComponent(<Account />);
  });
});
