import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { institutionalVault } from '__mocks__/models/vaults';
import { useRedeemFromInstitutionalVault, useWithdrawFromInstitutionalVault } from 'clients/api';
import { handleError } from 'libs/errors';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';

import { StatusContent } from '..';

vi.mock('libs/errors', async importOriginal => {
  const actual = await importOriginal<typeof import('libs/errors')>();

  return {
    ...actual,
    handleError: vi.fn(),
  };
});

describe('StatusContent', () => {
  const redeem = vi.fn();
  const withdraw = vi.fn();

  const renderStatusContent = ({
    onClose = vi.fn(),
    vault,
  }: {
    onClose?: () => void;
    vault: InstitutionalVault;
  }) => ({
    onClose,
    ...renderComponent(<StatusContent vault={vault} onClose={onClose} />),
  });

  beforeEach(() => {
    (useRedeemFromInstitutionalVault as Mock).mockReturnValue({
      mutateAsync: redeem,
      isPending: false,
    });

    (useWithdrawFromInstitutionalVault as Mock).mockReturnValue({
      mutateAsync: withdraw,
      isPending: false,
    });
  });

  it('claims the full redeemable amount and closes the modal', async () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Claim,
      userRedeemLimitMantissa: new BigNumber('250000000'),
    } satisfies InstitutionalVault;

    const { getByRole, onClose } = renderStatusContent({ vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.claim,
      }),
    );

    await waitFor(() => expect(redeem).toHaveBeenCalledTimes(1));
    expect(redeem).toHaveBeenCalledWith({
      amountMantissa: vault.userRedeemLimitMantissa,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

    expect(useRedeemFromInstitutionalVault).toHaveBeenCalledWith({
      vaultAddress: vault.vaultAddress,
    });
  });

  it('disables the claim button when there is no redeemable amount', () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Claim,
      userRedeemLimitMantissa: new BigNumber(0),
      userStakeBalanceMantissa: new BigNumber(0),
    } satisfies InstitutionalVault;

    const { getByRole } = renderStatusContent({ vault });

    expect(
      getByRole('button', {
        name: en.vault.modals.claim,
      }),
    ).toBeDisabled();
  });

  it('claims the full share balance when the vault is claimable before maxRedeem is updated', async () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Claim,
      userRedeemLimitMantissa: new BigNumber(0),
      userStakeBalanceMantissa: new BigNumber('150000000'),
    } satisfies InstitutionalVault;

    const { getByRole, onClose } = renderStatusContent({ vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.claim,
      }),
    );

    await waitFor(() => expect(redeem).toHaveBeenCalledTimes(1));
    expect(redeem).toHaveBeenCalledWith({
      amountMantissa: vault.userStakeBalanceMantissa,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('withdraws the full refundable amount and closes the modal', async () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Refund,
      userWithdrawLimitMantissa: new BigNumber('120000000'),
    } satisfies InstitutionalVault;

    const { getByRole, onClose } = renderStatusContent({ vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    );

    await waitFor(() => expect(withdraw).toHaveBeenCalledTimes(1));
    expect(withdraw).toHaveBeenCalledWith({
      amountMantissa: vault.userWithdrawLimitMantissa,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

    expect(useWithdrawFromInstitutionalVault).toHaveBeenCalledWith({
      vaultAddress: vault.vaultAddress,
    });
  });

  it('withdraws the full share balance when the vault is refundable before maxWithdraw is updated', async () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Refund,
      userWithdrawLimitMantissa: new BigNumber(0),
      userStakeBalanceMantissa: new BigNumber('150000000'),
    } satisfies InstitutionalVault;

    const { getByRole, onClose } = renderStatusContent({ vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    );

    await waitFor(() => expect(withdraw).toHaveBeenCalledTimes(1));
    expect(withdraw).toHaveBeenCalledWith({
      amountMantissa: vault.userStakeBalanceMantissa,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('withdraws the liquidated amount and closes the modal', async () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Liquidated,
      userWithdrawLimitMantissa: new BigNumber('120000000'),
    } satisfies InstitutionalVault;

    const { getByRole, onClose } = renderStatusContent({ vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    );

    await waitFor(() => expect(withdraw).toHaveBeenCalledTimes(1));
    expect(withdraw).toHaveBeenCalledWith({
      amountMantissa: vault.userWithdrawLimitMantissa,
    });
    expect(redeem).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('handles transaction errors without closing the modal', async () => {
    const onClose = vi.fn();
    const error = new Error('transaction failed');
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Claim,
      userRedeemLimitMantissa: new BigNumber('250000000'),
    } satisfies InstitutionalVault;

    redeem.mockRejectedValueOnce(error);

    const { getByRole } = renderStatusContent({ onClose, vault });

    fireEvent.click(
      getByRole('button', {
        name: en.vault.modals.claim,
      }),
    );

    await waitFor(() =>
      expect(handleError).toHaveBeenCalledWith({
        error,
      }),
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the deposits paused notice for non-claimable statuses', () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Paused,
    } satisfies InstitutionalVault;

    const { getByText, queryByRole } = renderStatusContent({ vault });

    expect(getByText(en.vault.modals.depositsPausedNotice)).toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: en.vault.modals.claim,
      }),
    ).not.toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: en.vault.modals.withdraw,
      }),
    ).not.toBeInTheDocument();
  });
});
