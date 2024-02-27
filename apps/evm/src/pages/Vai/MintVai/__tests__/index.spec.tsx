import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import vaiContractResponses from '__mocks__/contracts/vai';
import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { getMintableVai, getVaiTreasuryPercentage, mintVai } from 'clients/api';
import formatToMintableVaiOutput from 'clients/api/queries/getMintableVai/formatToOutput';
import { en } from 'libs/translations';
import { convertMantissaToTokens } from 'utilities';

import MintVai from '..';

const fakeFormatToMintableVaiInput = {
  mintCapResponse: vaiControllerResponses.mintCap,
  vaiTotalSupplyResponse: vaiContractResponses.totalSupply,
  accountMintableVaiResponse: vaiControllerResponses.getMintableVAI,
};

const fakeGetMintableVaiOutput = formatToMintableVaiOutput(fakeFormatToMintableVaiInput);

const fakeVaiTreasuryPercentage = 7.19;

describe('MintVai', () => {
  beforeEach(() => {
    (getMintableVai as Vi.Mock).mockImplementation(() => fakeGetMintableVaiOutput);
  });

  it('renders without crashing', () => {
    renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    (getVaiTreasuryPercentage as Vi.Mock).mockImplementationOnce(async () => ({
      percentage: fakeVaiTreasuryPercentage,
    }));

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
    const fakeMintableVai = convertMantissaToTokens({
      value: fakeGetMintableVaiOutput.vaiLiquidityMantissa,
      token: vai,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeMintableVai.toFixed()));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.mintVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.mintVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: fakeGetMintableVaiOutput.vaiLiquidityMantissa,
    });
  });

  it('does not let user mint VAI if there is no VAI left to mint', async () => {
    // mock getMintableVai, simulating that the total supply has reached the cap
    const fakeGetMintableVaiOutputToppedCap = formatToMintableVaiOutput({
      ...fakeFormatToMintableVaiInput,
      vaiTotalSupplyResponse: fakeFormatToMintableVaiInput.mintCapResponse,
    });
    (getMintableVai as Vi.Mock).mockImplementation(() => fakeGetMintableVaiOutputToppedCap);

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

  it('lets user mint up to global VAI left for minting if lower than the account limit', async () => {
    (mintVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);
    const remainingVaiAvailable = '10000000000000000';
    const remainingVaiAvailableMantissa = new BigNumber(remainingVaiAvailable);
    const totalVaiSupply = fakeFormatToMintableVaiInput.mintCapResponse.sub(remainingVaiAvailable);
    const fakeGetMintableVaiOutputWithTotalVaiSupply = formatToMintableVaiOutput({
      ...fakeFormatToMintableVaiInput,
      vaiTotalSupplyResponse: totalVaiSupply,
    });
    (getMintableVai as Vi.Mock).mockImplementation(
      () => fakeGetMintableVaiOutputWithTotalVaiSupply,
    );

    const { getByText, getByPlaceholderText } = renderComponent(<MintVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.mintVai.submitButtonDisabledLabel));
    // Click on "SAFE MAX" button
    const safeMaxButton = getByText(en.vai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of available VAI
    const fakeRemainingAvailableVaiTokens = convertMantissaToTokens({
      value: new BigNumber(remainingVaiAvailable),
      token: vai,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() =>
      expect(tokenTextFieldInput.value).toBe(fakeRemainingAvailableVaiTokens.toFixed()),
    );

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.mintVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.mintVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: remainingVaiAvailableMantissa,
    });
  });
});
