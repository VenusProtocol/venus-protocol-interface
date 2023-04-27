import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import {
  getBalanceOf,
  getMintedVai,
  getVaiCalculateRepayAmount,
  getVaiRepayAmountWithInterests,
  repayVai,
} from 'clients/api';
import formatToOutput from 'clients/api/queries/getVaiCalculateRepayAmount/formatToOutput';
import formatToGetVaiRepayAmountWithInterestsOutput from 'clients/api/queries/getVaiRepayAmountWithInterests/formatToOutput';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import RepayVai from '.';
import TEST_IDS from '../testIds';

jest.mock('clients/api');
jest.mock('components/Toast');
jest.mock('hooks/useSuccessfulTransactionModal');

jest.useFakeTimers();

const fakeUserVaiMintedWei = new BigNumber('100000000000000000000');
const repayInputAmountTokens = '100';

describe('pages/Dashboard/MintRepayVai/RepayVai', () => {
  beforeEach(() => {
    (getMintedVai as jest.Mock).mockImplementation(() => ({
      mintedVaiWei: fakeUserVaiMintedWei,
    }));

    (getVaiRepayAmountWithInterests as jest.Mock).mockImplementation(() =>
      formatToGetVaiRepayAmountWithInterestsOutput({
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayTotalAmount,
      }),
    );

    (getVaiCalculateRepayAmount as jest.Mock).mockImplementation(() =>
      formatToOutput({
        repayAmountWei: convertTokensToWei({
          value: new BigNumber(repayInputAmountTokens),
          token: TOKENS.vai,
        }),
        contractCallResults: fakeMulticallResponses.vaiController.getVaiRepayInterests,
      }),
    );
  });

  it('renders without crashing', () => {
    renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
  });

  it('displays the correct repay VAI balance and APY', async () => {
    const { getByText, container } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    expect(container.textContent).toMatchSnapshot();
  });

  it('lets user repay their VAI balance', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (repayVai as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    (getBalanceOf as jest.Mock).mockImplementation(() => ({
      balanceWei: fakeUserVaiMintedWei,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Input amount
    const fakeUserVaiMinted = convertWeiToTokens({
      valueWei: fakeUserVaiMintedWei,
      token: TOKENS.vai,
    });

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeUserVaiMinted.toFixed() } });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeUserVaiMinted.toFixed()));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountWei: fakeUserVaiMintedWei,
    });

    // Check successful transaction modal is displayed
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.vai,
        valueWei: fakeUserVaiMintedWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('displays the VAI repay fee', async () => {
    const { getByText, getByTestId } = renderComponent(() => <RepayVai />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(en.vai.repayVai.repayFeeLabel));

    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: repayInputAmountTokens } });

    await waitFor(() => expect(tokenTextFieldInput.value).toBe(repayInputAmountTokens));

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText('0.00031735 VAI (0.000317%)'));
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
