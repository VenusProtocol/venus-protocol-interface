import { fireEvent, waitFor } from '@testing-library/react';
import Vi from 'vitest';

import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { getMintableVai, getVaiTreasuryPercentage, mintVai } from 'clients/api';
import formatToMintableVaiOutput from 'clients/api/queries/getMintableVai/formatToOutput';
import { en } from 'packages/translations';
import { convertMantissaToTokens } from 'utilities';

import MintVai from '..';

const fakeGetMintableVaiOutput = formatToMintableVaiOutput(vaiControllerResponses.getMintableVAI);

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
      value: fakeGetMintableVaiOutput.mintableVaiMantissa,
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
      amountMantissa: fakeGetMintableVaiOutput.mintableVaiMantissa,
    });
  });
});
