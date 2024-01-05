import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import vaiContractResponses from '__mocks__/contracts/vai';
import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useGetMintableVai, useGetVaiTreasuryPercentage, useGetBalanceOf, mintVai } from 'clients/api';
import { en } from 'packages/translations';
import { convertMantissaToTokens } from 'utilities';

import MintVai from '..';

const fakeFormatToMintableVaiInput = {
  mintCapResponse: vaiControllerResponses.mintCap,
  vaiTotalSupplyResponse: vaiContractResponses.totalSupply,
  accountMintableVaiResponse: vaiControllerResponses.getMintableVAI,
};

const fakeVaiTreasuryPercentage = 7.19;
const fakeVaiBalanceMantissa = new BigNumber('40000000000000000000')
const fakeMintableVaiMantissa = new BigNumber('10000000000000000000');

describe('MintVai', () => {
  beforeEach(() => {
    (useGetMintableVai as Vi.Mock).mockImplementation(() => ({
      data: {
        mintableVaiMantissa: fakeMintableVaiMantissa
      },
      isLoading: false
    }));
    (useGetVaiTreasuryPercentage as Vi.Mock).mockImplementation(() => ({
      data: {
        percentage: fakeVaiTreasuryPercentage
      },
      isLoading: false
    }));
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeVaiBalanceMantissa
      },
      isLoading: false
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    const { getByText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText('40.00 VAI'));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user mint VAI', async () => {
    (mintVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.mintVai.submitButtonDisabledLabel));
    // Click on "SAFE MAX" button
    const safeMaxButton = getByText(en.vai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const fakeMintableVaiTokens = convertMantissaToTokens({
      value: fakeMintableVaiMantissa,
      token: vai,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVaiTokens.toFixed()));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.mintVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.mintVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: fakeMintableVaiMantissa,
    });
  });

  it('does not let user mint VAI if there is no VAI left to mint', async () => {
    // mock useGetMintableVai, simulating that the total supply has reached the cap
    (useGetMintableVai as Vi.Mock).mockImplementation(() => ({
      data: {
        mintableVaiMantissa: new BigNumber('0')
      },
      isLoading: false
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.mintVai.submitButtonDisabledLabel));

    // Check if the "SAFE MAX" button is disabled
    const safeMaxButton = getByText(en.vai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(safeMaxButton).toBeDisabled());

    // Check if the input is disabled
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput).toBeDisabled());
  });
});
