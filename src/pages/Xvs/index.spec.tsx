import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Xvs from '.';

jest.mock('clients/api');

describe('pages/Xvs', () => {
  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
