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
    const fakeUserVaiMinted = new BigNumber('100');

    const { getByText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          userVaiMinted: fakeUserVaiMinted,
          mintableVai: new BigNumber(0),
          userVaiBalance: new BigNumber(0),
        }}
      >
        <RepayVai />
      </VaiContext.Provider>,
    );
    await waitFor(() => getByText('Repay VAI balance'));

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText(`${fakeUserVaiMinted.toString()} VAI`));
  });
});
