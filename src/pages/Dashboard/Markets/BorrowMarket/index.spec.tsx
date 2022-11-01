import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowMarket from '.';

jest.mock('clients/api');

describe('pages/SupplyMarket', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
      },
      isLoading: false,
    }));
  });

  it('clicking row opens modal', async () => {
    const { getByText, getAllByText } = renderComponent(
      <BorrowMarket
        isXvsEnabled
        borrowMarketAssets={[]}
        borrowingAssets={assetData}
        userTotalBorrowLimitCents={new BigNumber(100000)}
      />,
    );
    const rowElement = getAllByText(assetData[2].token.symbol)[0];
    fireEvent.click(rowElement);
    const connectButton = getByText(en.borrowRepayModal.borrow.connectWalletMessage);
    expect(connectButton).toBeTruthy();
  });

  it('Hides borrowing token section when no tokens are borrowed', async () => {
    const { queryByLabelText, queryByRole } = renderComponent(
      <BorrowMarket
        borrowingAssets={[]}
        borrowMarketAssets={assetData}
        isXvsEnabled
        userTotalBorrowLimitCents={new BigNumber(11000)}
      />,
    );
    const borrowingTable = queryByLabelText(en.markets.borrowingTableTitle);
    expect(borrowingTable).toBeNull();
    const delimiter = queryByRole('hr');
    expect(delimiter).toBeNull();
  });
});
