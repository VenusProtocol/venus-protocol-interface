import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import Vi from 'vitest';

import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { renderComponent } from 'testUtils/render';

import { getVaiVaultUserInfo, withdrawFromVaiVault } from 'clients/api';
import formatToUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import { en } from 'packages/translations';

import WithdrawFromVaiVaultModal, { WithdrawFromVaiVaultModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

const fakeVaiVaultUserInfo = formatToUserInfo(vaiVaultResponses.userInfo);

const baseProps: WithdrawFromVaiVaultModalProps = {
  handleClose: noop,
};

describe('WithdrawFromVaiVaultModal', () => {
  beforeEach(() => {
    (getVaiVaultUserInfo as Vi.Mock).mockImplementation(() => fakeVaiVaultUserInfo);
  });

  it('renders without crashing', async () => {
    renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<WithdrawFromVaiVaultModal {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    (withdrawFromVaiVault as Vi.Mock).mockImplementation(() => fakeContractTransaction);

    const customProps: WithdrawFromVaiVaultModalProps = {
      ...baseProps,
      handleClose: vi.fn(),
    };

    const { getByTestId, getByText } = renderComponent(
      <WithdrawFromVaiVaultModal {...customProps} />,
      {
        accountAddress: fakeAccountAddress,
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

    const fakeStakedMantissa = new BigNumber(fakeValueTokens).multipliedBy(
      new BigNumber(10).pow(18),
    );

    await waitFor(() => expect(withdrawFromVaiVault).toHaveBeenCalledTimes(1));
    expect(withdrawFromVaiVault).toHaveBeenCalledWith({
      amountMantissa: fakeStakedMantissa,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
