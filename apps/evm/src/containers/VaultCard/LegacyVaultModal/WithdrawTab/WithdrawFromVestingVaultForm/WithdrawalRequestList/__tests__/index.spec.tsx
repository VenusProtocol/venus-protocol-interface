import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { LockedDeposit } from 'types';

import { WithdrawalRequestList, type WithdrawalRequestListProps } from '..';

vi.mock('hooks/useNow');

const baseProps: WithdrawalRequestListProps = {
  poolIndex: 1,
  stakedToken: xvs,
  rewardToken: vai,
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
    const { getByText, queryByText } = renderWithdrawalRequestList();

    expect(mockUseGetXvsVaultLockedDeposits).toHaveBeenCalledWith(
      {
        poolIndex: baseProps.poolIndex,
        rewardTokenAddress: baseProps.rewardToken.address,
        accountAddress: fakeAccountAddress,
      },
      {
        placeholderData: {
          lockedDeposits: [],
        },
        enabled: true,
      },
    );

    expect(
      getByText(en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.title),
    ).toBeInTheDocument();
    expect(
      getByText(en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.emptyState),
    ).toBeInTheDocument();
    expect(
      queryByText(
        en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.withdrawButtonLabel,
      ),
    ).not.toBeInTheDocument();
  });

  it('renders a spinner while deposits are loading', () => {
    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [],
      },
      isLoading: true,
      error: undefined,
    });

    const { getByAltText } = renderWithdrawalRequestList();

    expect(getByAltText('Spinner')).toBeInTheDocument();
  });

  it('renders a spinner when fetching deposits fails', () => {
    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [],
      },
      isLoading: false,
      error: new Error('Failed to fetch deposits'),
    });

    const { getByAltText } = renderWithdrawalRequestList();

    expect(getByAltText('Spinner')).toBeInTheDocument();
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

    const { getByRole, getByText } = renderWithdrawalRequestList();

    expect(getByText('1 XVS')).toBeInTheDocument();
    expect(getByText('2 XVS')).toBeInTheDocument();
    expect(
      getByText(en.requestWithdrawalFromVestingVaultForm.withdrawalRequestList.unlocked),
    ).toBeInTheDocument();
    expect(getByText(/Locked until 11\.01\.24/)).toBeInTheDocument();
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

    const { getByRole } = renderWithdrawalRequestList();

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
        poolIndex: baseProps.poolIndex,
        rewardTokenAddress: baseProps.rewardToken.address,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(mockUseExecuteWithdrawalFromXvsVault).toHaveBeenCalledWith({
      stakedToken: baseProps.stakedToken,
    });
  });
});
