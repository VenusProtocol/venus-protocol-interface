import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Vote from '.';

jest.mock('clients/api');

describe('pages/Vote', () => {
  it('renders without crashing', async () => {
    renderComponent(<Vote />);
  });
});
