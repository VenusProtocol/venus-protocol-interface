import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { switchAriaLabel } from 'components';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { enterMarkets, useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import SupplyMarket from '.';

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
      <SupplyMarket
        isXvsEnabled
        suppliedAssets={[]}
        supplyMarketAssets={assetData}
        accountAddress={fakeAccountAddress}
      />,
    );
    const rowElement = getAllByText(assetData[2].token.symbol)[0];
    fireEvent.click(rowElement);
    const connectButton = getByText(en.supplyWithdraw.connectWalletToSupply);
    expect(connectButton).toBeTruthy();
    await waitFor(() => expect(enterMarkets).toHaveBeenCalledTimes(0));
  });

  it('clicking toggle only toggles collateral', async () => {
    const { queryByText } = renderComponent(
      () => (
        <SupplyMarket
          isXvsEnabled
          suppliedAssets={[]}
          supplyMarketAssets={assetData}
          accountAddress={fakeAccountAddress}
        />
      ),
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );
    const toggle = document.querySelector(
      `input[aria-label="${switchAriaLabel}"]`,
    ) as HTMLButtonElement;
    fireEvent.click(toggle, { target: { ariaLabel: switchAriaLabel } });
    const connectButton = queryByText(en.supplyWithdraw.connectWalletToSupply);
    expect(connectButton).toBeNull();
    await waitFor(() => expect(enterMarkets).toHaveBeenCalledTimes(1));
  });

  it('Hides supplied token section when no tokens are supplied', async () => {
    const { queryByLabelText, queryByRole } = renderComponent(
      <SupplyMarket
        accountAddress="0x0"
        suppliedAssets={[]}
        supplyMarketAssets={assetData}
        isXvsEnabled
      />,
    );
    const suppliedTable = queryByLabelText(en.markets.suppliedTableTitle);
    expect(suppliedTable).toBeNull();
    const delimiter = queryByRole('hr');
    expect(delimiter).toBeNull();
  });
});
