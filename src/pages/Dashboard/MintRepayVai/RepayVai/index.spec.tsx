import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { repayVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { formatCoinsToReadableValue } from 'utilities/common';
import { AuthContext } from 'context/AuthContext';
import { VaiContext } from 'context/VaiContext';
import renderComponent from 'testUtils/renderComponent';
import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');

const fakeUserVaiMinted = new BigNumber('1000000');
const formattedFakeUserVaiMinted = formatCoinsToReadableValue({
  value: fakeUserVaiMinted,
  tokenId: 'vai',
});

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<RepayVai />);
    await waitFor(() => getByText('Repay VAI balance'));
  });

  it('displays the correct repay VAI balance', async () => {
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
    await waitFor(() => getByText(formattedFakeUserVaiMinted));
  });

  it('lets user repay their VAI balance', async () => {
    const fakeUserVaiBalance = fakeUserVaiMinted;
    const fakeAccountAddress = '0x0';

    const { getByText, getByPlaceholderText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          mintableVai: new BigNumber(0),
          userVaiMinted: fakeUserVaiMinted,
          userVaiBalance: fakeUserVaiBalance,
        }}
      >
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
          <RepayVai />
        </AuthContext.Provider>
      </VaiContext.Provider>,
    );
    await waitFor(() => getByText('Repay VAI balance'));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeUserVaiMinted.toString() } });

    // Check input value updated correctly
    expect(tokenTextFieldInput.value).toBe(fakeUserVaiMinted.toString());

    // Submit repayment request
    const submitButton = getByText('Repay VAI').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toHaveProperty('disabled', false));
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    const fakeUserWeiMinted = fakeUserVaiMinted.multipliedBy(new BigNumber(10).pow(18));
    expect(repayVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeUserWeiMinted,
    });

    // Check success toast is requested
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith({
      title: `You successfully repaid ${formattedFakeUserVaiMinted}`,
    });
  });

  // @TODO: add tests to cover failing scenarios
});
