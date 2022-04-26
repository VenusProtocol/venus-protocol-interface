import React from 'react';
import BigNumber from 'bignumber.js';
import { fireEvent, waitFor } from '@testing-library/react';
import { assetData } from '__mocks__/models/asset';
import renderComponent from 'testUtils/renderComponent';
import { enterMarkets, useUserMarketInfo } from 'clients/api';
import { switchAriaLabel } from 'components';
import en from 'translation/translations/en.json';
import { AuthContext } from 'context/AuthContext';
import SupplyMarket from '.';

const fakeAccountAddress = '0x0';

jest.mock('clients/api');

describe('components/SupplyMarket', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimit: new BigNumber('111'),
      userTotalBorrowBalance: new BigNumber('91'),
    }));
  });

  it('clicking row opens modal', async () => {
    const { getByText } = renderComponent(<SupplyMarket isXvsEnabled />);
    const rowElement = getByText(assetData[2].symbol);
    fireEvent.click(rowElement);
    const connectButton = getByText(en.supplyWithdraw.connectWalletToSupply);
    expect(connectButton).toBeTruthy();
    await waitFor(() => expect(enterMarkets).toHaveBeenCalledTimes(0));
  });

  it('clicking toggle only toggles collateral', async () => {
    const { queryByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAccountAddress,
          },
        }}
      >
        <SupplyMarket isXvsEnabled />
      </AuthContext.Provider>,
    );
    const toggle = document.querySelector(
      `input[aria-label="${switchAriaLabel}"]`,
    ) as HTMLButtonElement;
    fireEvent.click(toggle, { target: { ariaLabel: switchAriaLabel } });
    const connectButton = queryByText(en.supplyWithdraw.connectWalletToSupply);
    expect(connectButton).toBeNull();
    await waitFor(() => expect(enterMarkets).toHaveBeenCalledTimes(1));
  });
});
