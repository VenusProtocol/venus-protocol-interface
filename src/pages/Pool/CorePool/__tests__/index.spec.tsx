import React from 'react';

import { renderComponent } from 'testUtils/render';

import CorePool from '..';

describe('pages/Pool/CorePool', () => {
  it('renders without crashing', async () => {
    renderComponent(<CorePool />);
  });
});
