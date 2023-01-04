import React from 'react';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';

import Summary from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

describe('pages/Account/Summary', () => {
  it('renders without crashing', () => {
    renderComponent(<Summary pools={poolData} />);
  });

  it('displays stats correctly', () => {
    const { getByTestId } = renderComponent(<Summary pools={poolData} />);

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });

  it('displays account health when passing displayAccountHealth prop as true', () => {
    const { getByTestId } = renderComponent(<Summary pools={poolData} displayAccountHealth />);

    expect(getByTestId(TEST_IDS.accountHealth).textContent).toMatchSnapshot();
  });
});
