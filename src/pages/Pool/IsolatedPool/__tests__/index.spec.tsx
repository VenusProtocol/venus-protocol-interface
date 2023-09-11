import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import IsolatedPool from '..';

describe('pages/Pool/IsolatedPool', () => {
  it('renders without crashing', async () => {
    renderComponent(<IsolatedPool />);
  });
});
