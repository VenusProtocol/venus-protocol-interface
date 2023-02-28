import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { getAllowance, getVaiVaultUserInfo, withdrawFromVaiVault } from 'clients/api';
import formatToUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import MAX_UINT256 from 'constants/maxUint256';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import WithdrawFromVaiVaultModal, { WithdrawFromVaiVaultModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

jest.mock('clients/api');

const fakeVaiVaultUserInfo = formatToUserInfo(vaiVaultResponses.userInfo);

const baseProps: WithdrawFromVaiVaultModalProps = {
  handleClose: noop,
};

describe('pages/Vault/modals/WithdrawFromVaiVaultModal', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => ({
      allowanceWei: MAX_UINT256,
    }));
    (getVaiVaultUserInfo as jest.Mock).mockImplementation(() => fakeVaiVaultUserInfo);
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    (withdrawFromVaiVault as jest.Mock).mockImplementation(() => fakeContractReceipt);

    const customProps: WithdrawFromVaiVaultModalProps = {
      ...baseProps,
      handleClose: jest.fn(),
    };

    const { getByTestId, getByText } = renderComponent(
      <WithdrawFromVaiVaultModal {...customProps} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
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
      amountWei: fakeStakedWei,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
