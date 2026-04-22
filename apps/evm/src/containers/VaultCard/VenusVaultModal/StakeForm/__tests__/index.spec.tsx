import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useGetBalanceOf, useStakeInVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { StakeForm } from '..';

const fakeAvailableTokensMantissa = new BigNumber('100000000000000000000');

const fakeVaiVault = fakeVaults[0];
const fakeXvsVault = {
  ...fakeVaults[1],
  poolIndex: 1,
};

const fakeTokenApprovalOutput = {
  isTokenApproved: true,
  isWalletSpendingLimitLoading: false,
  isApproveTokenLoading: false,
  isRevokeWalletSpendingLimitLoading: false,
  walletSpendingLimitTokens: new BigNumber('100000000000000000000000000000000000000'),
  approveToken: vi.fn(),
  revokeWalletSpendingLimit: vi.fn(),
};

describe('StakeForm', () => {
  beforeEach(() => {
    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: fakeAvailableTokensMantissa,
      },
      isLoading: false,
    });

    (useStakeInVault as Mock).mockReturnValue({
      stake: vi.fn().mockResolvedValue(undefined),
      isLoading: false,
    });

    (useTokenApproval as Mock).mockReturnValue(fakeTokenApprovalOutput);
  });

  it('displays the connect wallet state when user is disconnected', () => {
    const { getByRole, getByText, queryByRole } = renderComponent(
      <StakeForm vault={fakeVaiVault} onClose={vi.fn()} />,
    );

    expect(getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument();
    expect(
      getByRole('button', {
        name: en.connectWallet.connectButton,
      }),
    ).toBeInTheDocument();
    expect(queryByRole('spinbutton')).not.toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
        token: fakeVaiVault.stakedToken,
      },
      {
        enabled: false,
      },
    );
  });

  it('uses the XVS vault contract as spender when poolIndex is defined', async () => {
    renderComponent(<StakeForm vault={fakeXvsVault} onClose={vi.fn()} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(useTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({
          accountAddress: fakeAccountAddress,
          spenderAddress: '0xfakeXvsVaultContractAddress',
          token: fakeXvsVault.stakedToken,
        }),
      ),
    );
  });

  it('uses the VAI vault contract as spender when poolIndex is not defined', async () => {
    renderComponent(<StakeForm vault={fakeVaiVault} onClose={vi.fn()} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(useTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({
          accountAddress: fakeAccountAddress,
          spenderAddress: '0xfakeVaiVaultContractAddress',
          token: fakeVaiVault.stakedToken,
        }),
      ),
    );
  });

  it('validates that the entered amount does not exceed the available balance', async () => {
    const { getByRole, getByText } = renderComponent(
      <StakeForm vault={fakeVaiVault} onClose={vi.fn()} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    fireEvent.change(getByRole('spinbutton'), {
      target: { value: '101' },
    });

    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );
  });

  it('validates that the entered amount does not exceed the wallet spending limit', async () => {
    (useTokenApproval as Mock).mockReturnValue({
      ...fakeTokenApprovalOutput,
      walletSpendingLimitTokens: new BigNumber(10),
    });

    const { getByRole, getByText } = renderComponent(
      <StakeForm vault={fakeXvsVault} onClose={vi.fn()} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    fireEvent.change(getByRole('spinbutton'), {
      target: { value: '11' },
    });

    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanWalletSpendingLimit)).toBeInTheDocument(),
    );
  });

  it('stakes the entered amount and closes the modal on success', async () => {
    const onClose = vi.fn();
    const stake = vi.fn().mockResolvedValue(undefined);
    const twelveTokensMantissa = new BigNumber('12000000000000000000');

    (useStakeInVault as Mock).mockReturnValue({
      stake,
      isLoading: false,
    });

    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: twelveTokensMantissa,
      },
      isLoading: false,
    });

    const { getByRole } = renderComponent(<StakeForm vault={fakeXvsVault} onClose={onClose} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(getByRole('button', { name: '12 XVS' }));

    const form = getByRole('button', {
      name: en.vaultCard.vaultModal.stakeForm.submitButton.label,
    }).closest('form');

    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => expect(stake).toHaveBeenCalledTimes(1));
    expect(stake).toHaveBeenCalledWith({
      amountMantissa: new BigNumber('12000000000000000000'),
      stakedToken: fakeXvsVault.stakedToken,
      rewardToken: fakeXvsVault.rewardToken,
      poolIndex: fakeXvsVault.poolIndex,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
