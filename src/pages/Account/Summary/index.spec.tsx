import React from 'react';

import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';

import Summary from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

describe('pages/Account/Summary', () => {
  it('renders without crashing', () => {
    renderComponent(<Summary assets={assetData} />);
  });

  it('displays stats correctly', () => {
    const { getByTestId } = renderComponent(<Summary assets={assetData} />);

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });

  it('displays account health when passing displayAccountHealth prop as true', () => {
    const { getByTestId } = renderComponent(<Summary assets={assetData} displayAccountHealth />);

    expect(getByTestId(TEST_IDS.accountHealth).textContent).toMatchSnapshot();
  });
});
