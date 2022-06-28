import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Proposal from '.';

jest.mock('clients/api');

describe('pages/Proposal', () => {
  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });
});
