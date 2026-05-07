import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { institutionalVault } from '__mocks__/models/vaults';
import { useRedeemFromInstitutionalVault, useWithdrawFromInstitutionalVault } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { VaultStatus } from 'types';

import { StatusContent } from '..';

describe('StatusContent', () => {
  const redeem = vi.fn().mockResolvedValue(undefined);
  const withdraw = vi.fn().mockResolvedValue(undefined);

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
    const onClose = vi.fn();
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Claim,
      userRedeemLimitMantissa: new BigNumber('250000000'),
    } satisfies InstitutionalVault;

    const { getByRole } = renderComponent(<StatusContent vault={vault} onClose={onClose} />);

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
    } satisfies InstitutionalVault;

    const { getByRole } = renderComponent(<StatusContent vault={vault} onClose={vi.fn()} />);

    expect(
      getByRole('button', {
        name: en.vault.modals.claim,
      }),
    ).toBeDisabled();
  });

  it('withdraws the full refundable amount and closes the modal', async () => {
    const onClose = vi.fn();
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Refund,
      userWithdrawLimitMantissa: new BigNumber('120000000'),
    } satisfies InstitutionalVault;

    const { getByRole } = renderComponent(<StatusContent vault={vault} onClose={onClose} />);

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

  it('renders the deposits paused notice for non-claimable statuses', () => {
    const vault = {
      ...institutionalVault,
      status: VaultStatus.Paused,
    } satisfies InstitutionalVault;

    const { getByText, queryByRole } = renderComponent(
      <StatusContent vault={vault} onClose={vi.fn()} />,
    );

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
