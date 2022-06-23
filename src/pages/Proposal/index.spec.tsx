import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Proposal from '.';

describe('pages/Proposal', () => {
  beforeAll(() => {
    jest.mock('clients/api');
  });
  it('renders without crashing', async () => {
    renderComponent(<Proposal />);
  });
});
