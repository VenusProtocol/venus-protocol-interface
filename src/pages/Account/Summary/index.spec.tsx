import BigNumber from 'bignumber.js';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import renderComponent from 'testUtils/renderComponent';

import Summary from '.';
import TEST_IDS from './testIds';

vi.mock('clients/api');

describe('pages/Account/Summary', () => {
  it('renders without crashing', () => {
    renderComponent(<Summary pools={poolData} />);
  });

  it('displays stats correctly', () => {
    const { getByTestId } = renderComponent(<Summary pools={poolData} />);

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });

  it('displays total vault stake when passing vaults prop and displayTotalVaultStake prop as true', () => {
    const { getByTestId } = renderComponent(
      <Summary
        pools={poolData}
        vaults={vaults}
        xvsPriceCents={new BigNumber(100)}
        vaiPriceCents={new BigNumber(328)}
        displayTotalVaultStake
      />,
    );

    expect(getByTestId(TEST_IDS.stats).textContent).toMatchSnapshot();
  });

  it('displays account health when passing displayAccountHealth prop as true', () => {
    const { getByTestId } = renderComponent(<Summary pools={poolData} displayAccountHealth />);

    expect(getByTestId(TEST_IDS.accountHealth).textContent).toMatchSnapshot();
  });
});
