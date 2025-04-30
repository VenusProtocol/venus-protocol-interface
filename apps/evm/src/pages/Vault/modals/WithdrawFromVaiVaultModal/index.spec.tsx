import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { en } from 'libs/translations';

import WithdrawFromVaiVaultModal, { type WithdrawFromVaiVaultModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

const baseProps: WithdrawFromVaiVaultModalProps = {
  handleClose: noop,
};

describe('WithdrawFromVaiVaultModal', () => {
  beforeEach(() => {
    (getVaiVaultUserInfo as Mock).mockImplementation(() => ({
      stakedVaiMantissa: new BigNumber('100000000000000000000000'),
    }));
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
    const mockWithdrawFromVaiVault = vi.fn();
    (useWithdrawFromVaiVault as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdrawFromVaiVault,
    }));

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

    await waitFor(() => expect(mockWithdrawFromVaiVault).toHaveBeenCalledTimes(1));
    expect(mockWithdrawFromVaiVault.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "amountMantissa": 100000000000000000000n,
        },
      ]
    `);

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
