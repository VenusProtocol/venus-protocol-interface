import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { LockedDeposit } from 'types';

import { WithdrawalRequestList, type WithdrawalRequestListProps } from '..';

vi.mock('hooks/useNow');

const fakeXvsVault = {
  ...fakeVaults[1],
  poolIndex: 1,
};

const baseProps: WithdrawalRequestListProps = {
  vault: fakeXvsVault,
  onClose: vi.fn(),
  hideWithdrawalRequestList: vi.fn(),
};

const makeLockedDeposit = (amountMantissa: string, unlockedAt: string): LockedDeposit => ({
  amountMantissa: new BigNumber(amountMantissa),
  unlockedAt: new Date(unlockedAt),
});

describe('WithdrawalRequestList', () => {
  const fakeNow = new Date('2024-01-10T00:00:00.000Z');
  const mockUseGetXvsVaultLockedDeposits = useGetXvsVaultLockedDeposits as Mock;
  const mockUseExecuteWithdrawalFromXvsVault = useExecuteWithdrawalFromXvsVault as Mock;
  const mockUseNow = useNow as Mock;

  const renderWithdrawalRequestList = (props: Partial<WithdrawalRequestListProps> = {}) =>
    renderComponent(<WithdrawalRequestList {...baseProps} {...props} />, {
      accountAddress: fakeAccountAddress,
    });

  beforeEach(() => {
    mockUseNow.mockReturnValue(fakeNow);

    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [],
      },
      isLoading: false,
      error: undefined,
    });

    mockUseExecuteWithdrawalFromXvsVault.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });

  it('fetches the connected user locked deposits and renders the empty state', () => {
    const { container } = renderWithdrawalRequestList();

    expect(mockUseGetXvsVaultLockedDeposits).toHaveBeenCalledWith(
      {
        poolIndex: baseProps.vault.poolIndex,
        rewardTokenAddress: baseProps.vault.rewardToken.address,
        accountAddress: fakeAccountAddress,
      },
      {
        placeholderData: {
          lockedDeposits: [],
        },
        enabled: true,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders locked and unlocked requests and enables withdrawal when any request is unlocked', () => {
    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [
          makeLockedDeposit('1000000000000000000', '2024-01-09T00:00:00.000Z'),
          makeLockedDeposit('2000000000000000000', '2024-01-11T00:00:00.000Z'),
        ],
      },
      isLoading: false,
      error: undefined,
    });

    const { container, getByRole } = renderWithdrawalRequestList();

    expect(container.textContent).toMatchSnapshot();
    expect(
      getByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.withdrawButtonLabel,
      }),
    ).toBeEnabled();
  });

  it('disables withdrawal when all requests are still locked', () => {
    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [makeLockedDeposit('1000000000000000000', '2024-01-11T00:00:00.000Z')],
      },
      isLoading: false,
      error: undefined,
    });

    const { container, getByRole } = renderWithdrawalRequestList();

    expect(container.textContent).toMatchSnapshot();
    expect(
      getByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.withdrawButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('calls hideWithdrawalRequestList when clicking the back button', async () => {
    const hideWithdrawalRequestList = vi.fn();
    const { getByRole } = renderWithdrawalRequestList({
      hideWithdrawalRequestList,
    });

    fireEvent.click(getByRole('button'));

    await waitFor(() => expect(hideWithdrawalRequestList).toHaveBeenCalledTimes(1));
  });

  it('executes the withdrawal and closes the modal when submitting', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [makeLockedDeposit('1000000000000000000', '2024-01-09T00:00:00.000Z')],
      },
      isLoading: false,
      error: undefined,
    });

    mockUseExecuteWithdrawalFromXvsVault.mockReturnValue({
      mutateAsync,
      isPending: false,
    });

    const { getByRole } = renderWithdrawalRequestList({ onClose });

    fireEvent.click(
      getByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.withdrawButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        poolIndex: baseProps.vault.poolIndex,
        rewardTokenAddress: baseProps.vault.rewardToken.address,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(mockUseExecuteWithdrawalFromXvsVault).toHaveBeenCalledWith({
      stakedToken: baseProps.vault.stakedToken,
    });
  });
});
