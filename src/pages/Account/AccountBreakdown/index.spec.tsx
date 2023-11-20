import React from 'react';

import { renderComponent } from 'testUtils/render';

import Account from '.';

describe('pages/Account', () => {
  it('renders without crashing', () => {
    renderComponent(<Account />);
  });
});
