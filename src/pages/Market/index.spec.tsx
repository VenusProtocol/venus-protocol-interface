import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import Market from '.';

describe('pages/Market', () => {
  it('renders without crashing', async () => {
    renderComponent(<Market />);
  });
});
