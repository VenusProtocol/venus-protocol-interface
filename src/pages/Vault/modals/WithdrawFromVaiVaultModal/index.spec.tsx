import React from 'react';
import noop from 'noop-ts';
import { waitFor, fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import TEST_IDS from 'constants/testIds';
import MAX_UINT256 from 'constants/maxUint256';
import fakeAccountAddress from '__mocks__/models/address';
import { getVaiVaultUserInfo, getAllowance, withdrawFromVaiVault } from 'clients/api';
import formatToUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import WithdrawFromVaiVaultModal, { WithdrawFromVaiVaultModalProps } from '.';

jest.mock('clients/api');

const fakeVaiVaultUserInfo = formatToUserInfo(vaiVaultResponses.userInfo);

const baseProps: WithdrawFromVaiVaultModalProps = {
  handleClose: noop,
};

describe('pages/Vault/modals/WithdrawFromVaiVaultModal', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => MAX_UINT256);
    (getVaiVaultUserInfo as jest.Mock).mockImplementation(() => fakeVaiVaultUserInfo);
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() =>
      expect(
        getByTestId(TEST_IDS.vault.transactionForm.availableTokens).textContent,
      ).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    (withdrawFromVaiVault as jest.Mock).mockImplementation(() => fakeTransactionReceipt);

    const customProps: WithdrawFromVaiVaultModalProps = {
      ...baseProps,
      handleClose: jest.fn(),
    };

    const { getByTestId, getByText } = renderComponent(
      <WithdrawFromVaiVaultModal {...customProps} />,
      {
        authContextValue: {
          account: {
            address: fakeAccountAddress,
          },
        },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.vault.transactionForm.tokenTextField));

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.vault.transactionForm.tokenTextField), {
      target: { value: fakeValueTokens },
    });

    await waitFor(() => getByText(en.withdrawFromVaiVaultModal.submitButtonLabel));

    // Submit form
    const submitButton = getByText(en.withdrawFromVaiVaultModal.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    const fakeStakedWei = new BigNumber(fakeValueTokens).multipliedBy(new BigNumber(10).pow(18));

    await waitFor(() => expect(withdrawFromVaiVault).toHaveBeenCalledTimes(1));
    expect(withdrawFromVaiVault).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      amountWei: fakeStakedWei,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
