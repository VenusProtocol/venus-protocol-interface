import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { mintVai, getVaiTreasuryPercentage } from 'clients/api';
import toast from 'components/Basic/Toast';
import { formatCoinsToReadableValue } from 'utilities/common';
import { AuthContext } from 'context/AuthContext';
import { VaiContext } from 'context/VaiContext';
import renderComponent from 'testUtils/renderComponent';
import RepayVai from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');

const fakeMintableVai = new BigNumber('1000');
const formattedFakeUserVaiMinted = formatCoinsToReadableValue({
  value: fakeMintableVai,
  tokenSymbol: 'vai',
});
const fakeVaiTreasuryPercentage = 7.19;

describe('pages/Dashboard/MintRepayVai/MintVai', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(<RepayVai />);
    await waitFor(() => getByText('Available VAI limit'));
  });

  it('displays the correct available VAI limit and mint fee', async () => {
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
    await waitFor(() => getByText(formattedFakeUserVaiMinted));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user mint VAI', async () => {
    const fakeAccountAddress = '0x0';

    const { getByText, getByPlaceholderText } = renderComponent(
      <VaiContext.Provider
        value={{
          userVaiEnabled: true,
          mintableVai: fakeMintableVai,
          userVaiMinted: new BigNumber(0),
          userVaiBalance: new BigNumber(0),
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
    await waitFor(() => getByText('Available VAI limit'));

    // Click on "SAFE MAX" button
    const safeMaxButton = getByText('SAFE MAX').closest('button') as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVai.toString()));

    // Submit repayment request
    const submitButton = getByText('Mint VAI').closest('button') as HTMLButtonElement;
    await waitFor(() => expect(submitButton).toHaveProperty('disabled', false));
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    const fakeWeiMinted = fakeMintableVai.multipliedBy(new BigNumber(10).pow(18));
    expect(mintVai).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeWeiMinted,
      vaiControllerContract: expect.any(Object),
    });

    // Check success toast is requested
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith({
      title: `You successfully minted ${formattedFakeUserVaiMinted}`,
    });
  });

  // @TODO: add tests to cover failing scenarios
});
