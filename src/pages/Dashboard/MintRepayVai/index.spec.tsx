import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';
import { useUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import { assetData } from '__mocks__/models/asset';
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
    const { getByText } = renderComponent(<MintRepayVai />);
    await waitFor(() => getByText('Mint/Repay VAI'));
  });

  it('renders mint tab by default and lets user switch to repay tab', async () => {
    const { getByText } = renderComponent(<MintRepayVai />);

    // Check mint tab is display by default
    await waitFor(() => getByText('Available VAI limit'));

    // Click on "Repay VAI" tab
    const repayVaiTabButton = getByText('Repay VAI').closest('button') as HTMLButtonElement;
    fireEvent.click(repayVaiTabButton);

    // Check repay tab is now displaying
    await waitFor(() => getByText('Repay VAI balance'));
  });
});
