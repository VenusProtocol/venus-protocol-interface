import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import VoterDetail from '.';

describe('pages/VoterDetail', () => {
  beforeAll(() => {
    jest.mock('clients/api');
  });

  it('renders without crashing', async () => {
    renderComponent(<VoterDetail />);
  });
});
