import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import Account from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

describe('pages/Account', () => {
  // TODO: mock relevant requests once wired up

  it('renders without crashing', () => {
    renderComponent(<Account />);
  });

  it('displays stats correctly', () => {
    const { getByTestId } = renderComponent(<Account />);

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });
});
