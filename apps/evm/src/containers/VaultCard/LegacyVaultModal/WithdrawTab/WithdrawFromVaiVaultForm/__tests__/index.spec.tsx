import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { useGetToken } from 'libs/tokens';
import { en } from 'libs/translations';
import { useAuthModal } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { WithdrawFromVaiVaultForm } from '..';
import transactionFormTestIds from '../../../TransactionForm/testIds';

const fakeStakedVaiMantissa = new BigNumber('100000000000000000000');

describe('WithdrawFromVaiVaultForm', () => {
  beforeEach(() => {
    (useAuthModal as Mock).mockReturnValue({
      openAuthModal: vi.fn(),
    });

    (useGetToken as Mock).mockReturnValue(vai);

    (useGetVaiVaultUserInfo as Mock).mockReturnValue({
      data: {
        stakedVaiMantissa: fakeStakedVaiMantissa,
      },
      isLoading: false,
    });

    (useWithdrawFromVaiVault as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('prompts the user to connect their wallet when disconnected', () => {
    const { getByText } = renderComponent(<WithdrawFromVaiVaultForm onClose={vi.fn()} />);

    expect(
      getByText(
        en.withdrawFromVaiVaultModalForm.connectWalletMessage.replace(
          '{{tokenSymbol}}',
          vai.symbol,
        ),
      ),
    ).toBeInTheDocument();
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();
  });

  it('displays a spinner while user info is loading', () => {
    (useGetVaiVaultUserInfo as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { getByAltText, queryByText } = renderComponent(
      <WithdrawFromVaiVaultForm onClose={vi.fn()} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(getByAltText('Spinner')).toBeInTheDocument();
    expect(
      queryByText(en.withdrawFromVaiVaultModalForm.submitButtonDisabledLabel),
    ).not.toBeInTheDocument();
  });

  it('renders the real transaction form with the user staked VAI balance', async () => {
    const { getByTestId, getByText } = renderComponent(
      <WithdrawFromVaiVaultForm onClose={vi.fn()} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText(en.withdrawFromVaiVaultModalForm.submitButtonDisabledLabel));

    expect(getByTestId(transactionFormTestIds.availableTokens)).toHaveTextContent(
      en.withdrawFromVaiVaultModalForm.availableTokensLabel.replace('{{tokenSymbol}}', vai.symbol),
    );
    expect(getByTestId(transactionFormTestIds.availableTokens)).toHaveTextContent('100 VAI');
    expect(
      getByText(en.withdrawFromVaiVaultModalForm.submitButtonDisabledLabel).closest('button'),
    ).toBeDisabled();
  });

  it('withdraws the entered amount and closes the modal on success', async () => {
    const onCloseMock = vi.fn();
    const withdrawMock = vi.fn().mockResolvedValue(undefined);

    (useWithdrawFromVaiVault as Mock).mockReturnValue({
      mutateAsync: withdrawMock,
      isPending: false,
    });

    const { getByRole, getByTestId, getByText } = renderComponent(
      <WithdrawFromVaiVaultForm onClose={onCloseMock} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText(en.withdrawFromVaiVaultModalForm.submitButtonDisabledLabel));

    fireEvent.change(getByTestId(transactionFormTestIds.tokenTextField), {
      target: { value: '1.5' },
    });

    await waitFor(() =>
      expect(
        getByRole('button', {
          name: en.withdrawFromVaiVaultModalForm.submitButtonLabel,
        }),
      ).toBeEnabled(),
    );

    const submitButton = getByRole('button', {
      name: en.withdrawFromVaiVaultModalForm.submitButtonLabel,
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(withdrawMock).toHaveBeenCalledTimes(1));
    expect(withdrawMock).toHaveBeenCalledWith({
      amountMantissa: BigInt('1500000000000000000'),
    });
    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
