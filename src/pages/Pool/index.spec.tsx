import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import { CorePool, IsolatedPool } from '.';

describe('pages/Pool', () => {
  describe('CorePool', () => {
    it('renders without crashing', async () => {
      renderComponent(<CorePool />);
    });
  });

  describe('IsolatedPool', () => {
    it('renders without crashing', async () => {
      renderComponent(<IsolatedPool />);
    });
  });
});
