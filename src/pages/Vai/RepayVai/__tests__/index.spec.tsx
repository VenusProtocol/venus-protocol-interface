import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  getBalanceOf,
  getVaiCalculateRepayAmount,
  getVaiRepayAmountWithInterests,
  repayVai,
} from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import useTokenApproval from 'hooks/useTokenApproval';
import { getVaiControllerContractAddress } from 'packages/contracts';
import { en } from 'packages/translations';
import { ChainId } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import RepayVai from '..';
import TEST_IDS from '../../testIds';

const VAI_CONTROLLER_CONTRACT_ADDRESS = getVaiControllerContractAddress({
  chainId: ChainId.BSC_TESTNET,
})!;

vi.mock('hooks/useTokenApproval');

vi.useFakeTimers();

const repayInputAmountTokens = '100';

const repayInputAmountMantissa = convertTokensToMantissa({
  value: new BigNumber(repayInputAmountTokens),
  token: vai,
});

const fullRepayBalanceMantissa = new BigNumber('5669568627692799723381666');

const fullRepayBalanceTokens = convertMantissaToTokens({
  value: fullRepayBalanceMantissa,
  token: vai,
}).toString();

describe('RepayVai', () => {
  beforeEach(() => {
    (getVaiRepayAmountWithInterests as Vi.Mock).mockImplementation(() => ({
      vaiRepayAmountWithInterestsMantissa: fullRepayBalanceMantissa,
    }));

    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceMantissa: fullRepayBalanceMantissa,
    }));

    (getVaiCalculateRepayAmount as Vi.Mock).mockImplementation(() => ({
      vaiRepayAmountAfterFeeMantissa: new BigNumber('99999682649407787691'),
      vaiCurrentInterestMantissa: new BigNumber('317350590885224'),
      vaiPastInterestMantissa: new BigNumber('0'),
      vaiTotalInterestMantissa: new BigNumber('317350590885224'),
      feePercentage: 0.000317350590885224,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct repay VAI balance and APY', async () => {
    const { getByText, container } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: vai,
      spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });

    // Check spending limit is correctly displayed
    await waitFor(() => getByTestId(TEST_IDS.spendingLimit));
    expect(getByTestId(TEST_IDS.spendingLimit).textContent).toMatchSnapshot();

    // Press on revoke button
    const revokeSpendingLimitButton = within(getByTestId(TEST_IDS.spendingLimit)).getByRole(
      'button',
    );

    fireEvent.click(revokeSpendingLimitButton);

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('displays the VAI repay fee correctly', async () => {
    const { getByText, getByTestId } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => getByText(en.vai.repayVai.repayFeeLabel));

    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: repayInputAmountTokens } });

    // Check user repay VAI balance displays correctly
    await waitFor(() => getByText('0.00031 VAI (0.000317%)'));
  });

  it('disables submit button if token has been approved but amount entered is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: vai,
      spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId, getByText } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Enter amount in input
    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));
    expect(getByText(en.vai.repayVai.submitButtonDisabledLabel).closest('button')).toBeDisabled();
  });

  it('lets user repay some of their VAI loan', async () => {
    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: repayInputAmountTokens },
    });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(repayInputAmountTokens));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountMantissa: repayInputAmountMantissa,
    });
  });

  it('lets user repay their entire VAI loan', async () => {
    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByText, getByTestId } = renderComponent(<RepayVai />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repayVai.submitButtonDisabledLabel));

    // Click on max button
    fireEvent.click(getByText(en.vai.repayVai.rightMaxButtonLabel));

    // Check input value updated correctly
    const tokenTextFieldInput = getByTestId(TEST_IDS.repayTextField) as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fullRepayBalanceTokens));

    // Check warning notice is displayed
    expect(getByText(en.vai.repayVai.fullRepayWarning)).toBeInTheDocument();

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repayVai.submitButtonLabel)));

    const submitButton = getByText(en.vai.repayVai.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repayVai was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountMantissa: MAX_UINT256,
    });
  });

  // TODO: add tests to cover failing scenarios (see VEN-631)
});
