import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import en from 'translation/translations/en.json';
import { useUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
import fakeAccountAddress from '__mocks__/models/address';
import MintRepayVai from '.';

jest.mock('clients/api');

const fakeVai = { ...assetData, id: 'vai', symbol: 'VAI', isEnabled: true };

describe('pages/Dashboard/MintRepayVai', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [...assetData, fakeVai],
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(() => <MintRepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });
    await waitFor(() => getByText(en.mintRepayVai.title));
  });

  it('renders mint tab by default and lets user switch to repay tab', async () => {
    const { getByText } = renderComponent(() => <MintRepayVai />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    // Check mint tab is display by default
    await waitFor(() => getByText(en.mintRepayVai.mintVai.enableToken));

    // Click on "Repay VAI" tab
    const repayVaiTabButton = getByText(en.mintRepayVai.tabRepay).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(repayVaiTabButton);

    // Check repay tab is now displaying
    await waitFor(() => getByText(en.mintRepayVai.repayVai.enableToken));
  });
});
