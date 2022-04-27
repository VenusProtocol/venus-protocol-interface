import React from 'react';
import BigNumber from 'bignumber.js';
import { fireEvent } from '@testing-library/react';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import { useUserMarketInfo } from 'clients/api';
import en from 'translation/translations/en.json';
import BorrowMarket from '.';

jest.mock('clients/api');

describe('pages/SupplyMarket', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('clicking row opens modal', async () => {
    const { getByText } = renderComponent(
      <BorrowMarket
        isXvsEnabled
        borrowMarketAssets={[]}
        borrowingAssets={assetData}
        userTotalBorrowLimit={new BigNumber(1000)}
      />,
    );
    const rowElement = getByText(assetData[2].symbol);
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
        userTotalBorrowLimit={new BigNumber(110)}
      />,
    );
    const borrowingTable = queryByLabelText(en.markets.borrowingTableTitle);
    expect(borrowingTable).toBeNull();
    const delimiter = queryByRole('hr');
    expect(delimiter).toBeNull();
  });
});
