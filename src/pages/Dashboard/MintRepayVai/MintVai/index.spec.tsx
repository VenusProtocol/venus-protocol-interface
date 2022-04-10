import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';

import { getVaiTreasuryPercentage } from 'clients/api';
// import { AuthContext } from 'context/AuthContext';
import { VaiContext } from 'context/VaiContext';
import renderComponent from 'testUtils/renderComponent';
import RepayVai from '.';

jest.mock('clients/api');

describe('pages/Dashboard/MintRepayVai/MintVai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<RepayVai />);
    await waitFor(() => getByText('Available VAI limit'));
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    const fakeMintableVai = new BigNumber('100');
    const fakeVaiTreasuryPercentage = 7.19;
    (getVaiTreasuryPercentage as jest.Mock).mockImplementationOnce(
      async () => fakeVaiTreasuryPercentage,
    );

    const { getByText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          userVaiMinted: new BigNumber(0),
          mintableVai: fakeMintableVai,
          userVaiBalance: new BigNumber(0),
        }}
      >
        <RepayVai />
      </VaiContext.Provider>,
    );
    await waitFor(() => getByText('Available VAI limit'));

    // Check available VAI limit displays correctly
    await waitFor(() => getByText(`${fakeMintableVai.toString()} VAI`));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  // @TODO: add tests to cover failing scenarios
});
