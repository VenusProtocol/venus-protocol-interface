import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';

import { VaiContext } from 'context/VaiContext';
import renderComponent from 'testUtils/renderComponent';
import RepayVai from '.';

jest.mock('clients/api');

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<RepayVai />);
    await waitFor(() => getByText('Repay VAI balance'));
  });

  it('displays the correct repay VAI balance', async () => {
    const fakeUserVaiBalance = new BigNumber('100');

    const { getByText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          userVaiMinted: new BigNumber(0),
          mintableVai: new BigNumber(0),
          userVaiBalance: fakeUserVaiBalance,
        }}
      >
        <RepayVai />
      </VaiContext.Provider>,
    );
    await waitFor(() => getByText('Repay VAI balance'));

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText(`${fakeUserVaiBalance.toString()} VAI`));
  });
});
