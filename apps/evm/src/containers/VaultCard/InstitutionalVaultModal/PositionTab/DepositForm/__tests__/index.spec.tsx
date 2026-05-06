import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { institutionalVault } from '__mocks__/models/vaults';
import { useGetBalanceOf, useStakeIntoInstitutionalVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { routes } from 'constants/routing';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { InstitutionalVault } from 'types';
import { formatTokensToReadableValue } from 'utilities';

import { DepositForm } from '..';

const fakeWalletBalanceMantissa = new BigNumber('12000000');

const vault = {
  ...institutionalVault,
  stakeLimitMantissa: new BigNumber('15000000'),
  stakeBalanceMantissa: new BigNumber('2000000'),
} satisfies InstitutionalVault;

const limitedCapacityVault = {
  ...vault,
  stakeLimitMantissa: new BigNumber('5000000'),
  userMinIndividualStakeMantissa: new BigNumber('1000000'),
} satisfies InstitutionalVault;

const makeUseTokenApprovalOutput = () => ({
  isTokenApproved: true,
  isWalletSpendingLimitLoading: false,
  isApproveTokenLoading: false,
  isRevokeWalletSpendingLimitLoading: false,
  walletSpendingLimitTokens: new BigNumber(100),
  approveToken: vi.fn(),
  revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
});

describe('DepositForm', () => {
  beforeEach(() => {
    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: fakeWalletBalanceMantissa,
      },
      isLoading: false,
    });

    (useStakeIntoInstitutionalVault as Mock).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });

    (useTokenApproval as Mock).mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('displays the disconnected state and skips the amount field', async () => {
    renderComponent(<DepositForm vault={vault} onClose={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
        token: vault.stakedToken,
      },
      {
        enabled: false,
      },
    );
  });

  it('caps the available amount by the remaining capacity and renders the institutional copy', async () => {
    const expectedLimitTokens = new BigNumber(3);
    const minimumDepositTokens = new BigNumber(1);
    const expectedMinimumDepositMessage = en.operationForm.error.smallerThanMinimumAmount.replace(
      '{{minAmount}}',
      formatTokensToReadableValue({
        value: minimumDepositTokens,
        token: limitedCapacityVault.stakedToken,
      }),
    );

    renderComponent(<DepositForm vault={limitedCapacityVault} onClose={vi.fn()} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(screen.getByText(en.vault.modals.institutionalDisclaimer)).toBeInTheDocument(),
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms of use/i })).toHaveAttribute(
      'href',
      expect.stringContaining(routes.fixedTermVaultTermsOfUse.path),
    );

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: {
        value: '0.5',
      },
    });

    await waitFor(() =>
      expect(screen.getByText(expectedMinimumDepositMessage)).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: formatTokensToReadableValue({
          value: expectedLimitTokens,
          token: vault.stakedToken,
        }),
      }),
    );

    await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(3));
  });

  it('submits the deposit amount and closes the modal on success', async () => {
    const onClose = vi.fn();
    const deposit = vi.fn().mockResolvedValue(undefined);
    const expectedAmountTokens = new BigNumber(12);
    const expectedAmountMantissa = new BigNumber('12000000');

    (useStakeIntoInstitutionalVault as Mock).mockReturnValue({
      mutateAsync: deposit,
      isPending: false,
    });

    renderComponent(<DepositForm vault={vault} onClose={onClose} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(useStakeIntoInstitutionalVault).toHaveBeenCalledWith({
        vaultAddress: vault.vaultAddress,
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: formatTokensToReadableValue({
          value: expectedAmountTokens,
          token: vault.stakedToken,
        }),
      }),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vault.modals.deposit,
        }),
      ).toBeDisabled(),
    );

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: en.vault.modals.deposit,
        }),
      ).toBeEnabled(),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: en.vault.modals.deposit,
      }),
    );

    await waitFor(() => expect(deposit).toHaveBeenCalledTimes(1));
    expect(deposit).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
