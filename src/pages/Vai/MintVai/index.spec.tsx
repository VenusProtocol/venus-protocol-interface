import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { convertWeiToTokens } from 'utilities';
import Vi from 'vitest';

import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { getMintableVai, getVaiTreasuryPercentage, mintVai } from 'clients/api';
import formatToMintableVaiOutput from 'clients/api/queries/getMintableVai/formatToOutput';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';

vi.mock('clients/api');
vi.mock('components/Toast');
vi.mock('hooks/useSuccessfulTransactionModal');

const fakeGetMintableVaiOutput = formatToMintableVaiOutput(vaiControllerResponses.getMintableVAI);

const fakeVaiTreasuryPercentage = 7.19;

describe('pages/Dashboard/vai/MintVai', () => {
  beforeEach(() => {
    (getMintableVai as Vi.Mock).mockImplementation(() => fakeGetMintableVaiOutput);
  });

  it('renders without crashing', () => {
    renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
  });

  it('displays the correct available VAI limit and mint fee', async () => {
    (getVaiTreasuryPercentage as Vi.Mock).mockImplementationOnce(async () => ({
      percentage: fakeVaiTreasuryPercentage,
    }));

    const { getByText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText('40.00 VAI'));
    // Check mint fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user mint VAI', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    (mintVai as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.mintVai.submitButtonDisabledLabel));

    // Click on "SAFE MAX" button
    const safeMaxButton = getByText(en.vai.mintVai.rightMaxButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value updated to max amount of mintable VAI
    const fakeMintableVai = convertWeiToTokens({
      valueWei: fakeGetMintableVaiOutput.mintableVaiWei,
      token: TOKENS.vai,
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
      amountWei: fakeGetMintableVaiOutput.mintableVaiWei,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fakeGetMintableVaiOutput.mintableVaiWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
