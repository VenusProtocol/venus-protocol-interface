import React from 'react';

import { poolData } from '__mocks__/models/pools';
import renderComponent from 'testUtils/renderComponent';

import Summary from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');

describe('pages/Account/Summary', () => {
  it('renders without crashing', () => {
    renderComponent(<Summary assets={poolData[0].assets} />);
  });

  it('displays stats correctly', () => {
    const { getByTestId } = renderComponent(<Summary assets={poolData[0].assets} />);

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });

  it('displays account health when passing displayAccountHealth and safeBorrowLimitPercentage props', () => {
    const { getByTestId } = renderComponent(
      <Summary assets={poolData[0].assets} displayAccountHealth safeBorrowLimitPercentage={80} />,
    );

    expect(getByTestId(TEST_IDS.accountHealth).textContent).toMatchSnapshot();
  });
});
