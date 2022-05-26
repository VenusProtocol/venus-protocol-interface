import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Vault from '.';

describe('pages/Vault', () => {
  it('renders without crashing', async () => {
    renderComponent(<Vault />);
  });
});
