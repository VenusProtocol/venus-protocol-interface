import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import Account from '.';

jest.mock('clients/api');

describe('pages/Account', () => {
  it('renders without crashing', () => {
    renderComponent(<Account />);
  });

  // TODO: add tests
});
