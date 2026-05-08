import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useGetBalanceOf, useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { WithdrawFromVaiVaultForm } from '..';

const fakeStakedVaiMantissa = new BigNumber('100000000000000000000');
const fakeVaiVault = fakeVaults[0];

describe('WithdrawFromVaiVaultForm', () => {
  beforeEach(() => {
    (useGetVaiVaultUserInfo as Mock).mockReturnValue({
      data: {
        stakedVaiMantissa: fakeStakedVaiMantissa,
      },
      isLoading: false,
    });

    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: fakeStakedVaiMantissa,
      },
      isLoading: false,
    });

    (useWithdrawFromVaiVault as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('renders the connect wallet state when user is disconnected', () => {
    renderComponent(<WithdrawFromVaiVaultForm vault={fakeVaiVault} onClose={vi.fn()} />);

    expect(screen.getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: en.connectWallet.connectButton }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();

    expect(useGetVaiVaultUserInfo).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
      },
      {
        enabled: false,
      },
    );
  });

  it('renders the user staked VAI balance when connected', async () => {
    renderComponent(<WithdrawFromVaiVaultForm vault={fakeVaiVault} onClose={vi.fn()} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.getByRole('button', {
        name: en.vaultCard.vaultModal.withdrawFromVaiVault.submitButton.label,
      }),
    ).toBeDisabled();
    expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '100 VAI' })).toBeInTheDocument();

    await waitFor(() =>
      expect(useGetVaiVaultUserInfo).toHaveBeenCalledWith(
        {
          accountAddress: fakeAccountAddress,
        },
        {
          enabled: true,
        },
      ),
    );
  });

  it('withdraws the selected amount and closes the modal on success', async () => {
    const onCloseMock = vi.fn();
    const withdrawMock = vi.fn().mockResolvedValue(undefined);

    (useWithdrawFromVaiVault as Mock).mockReturnValue({
      mutateAsync: withdrawMock,
      isPending: false,
    });

    renderComponent(<WithdrawFromVaiVaultForm vault={fakeVaiVault} onClose={onCloseMock} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(screen.getByRole('button', { name: '100 VAI' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vaultCard.vaultModal.withdrawFromVaiVault.submitButton.label,
        }),
      ).toBeEnabled(),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: en.vaultCard.vaultModal.withdrawFromVaiVault.submitButton.label,
      }),
    );

    await waitFor(() => expect(withdrawMock).toHaveBeenCalledTimes(1));
    expect(withdrawMock).toHaveBeenCalledWith({
      amountMantissa: BigInt('100000000000000000000'),
    });
    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
