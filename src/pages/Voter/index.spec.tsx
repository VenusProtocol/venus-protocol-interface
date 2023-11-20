import React from 'react';

import { renderComponent } from 'testUtils/render';

import Voter from '.';

describe('pages/Voter', () => {
  it('renders without crashing', async () => {
    renderComponent(<Voter />);
  });
});
