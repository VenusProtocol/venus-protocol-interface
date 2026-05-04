import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { vaults } from '__mocks__/models/vaults';
import {
  useGetBalanceOf,
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { RequestWithdrawalForm, type RequestWithdrawalFormProps } from '..';

vi.mock('hooks/useNow');

const oneTokenMantissa = new BigNumber('1000000000000000000');
const hundredTokensMantissa = oneTokenMantissa.multipliedBy(100);
const tenTokensMantissa = oneTokenMantissa.multipliedBy(10);

const submitButtonLabel =
  en.vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.submitButton.label;
const displayWithdrawalRequestListButtonLabel =
  en.vaultCard.vaultModal.requestWithdrawalFromVestingVaultForm.displayWithdrawalRequestListButton
    .label;

const baseProps: RequestWithdrawalFormProps = {
  vault: {
    ...vaults[1],
    poolIndex: 1,
    rewardToken: vai,
  },
  displayWithdrawalRequestList: vi.fn(),
};

describe('RequestWithdrawalForm', () => {
  const mockUseGetXvsVaultLockedDeposits = useGetXvsVaultLockedDeposits as Mock;
  const mockUseGetBalanceOf = useGetBalanceOf as Mock;
  const mockUseGetXvsVaultUserInfo = useGetXvsVaultUserInfo as Mock;
  const mockUseGetPrimeToken = useGetPrimeToken as Mock;
  const mockUseGetPrimeStatus = useGetPrimeStatus as Mock;
  const mockUseRequestWithdrawalFromXvsVault = useRequestWithdrawalFromXvsVault as Mock;
  const mockUseNow = useNow as Mock;

  const renderRequestWithdrawalForm = (props: Partial<RequestWithdrawalFormProps> = {}) =>
    renderComponent(<RequestWithdrawalForm {...baseProps} {...props} />, {
      accountAddress: fakeAccountAddress,
    });

  beforeEach(() => {
    mockUseNow.mockReturnValue(new Date('2024-01-10T00:00:00.000Z'));

    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [],
      },
      isLoading: false,
    });

    mockUseGetXvsVaultUserInfo.mockReturnValue({
      data: {
        stakedAmountMantissa: hundredTokensMantissa,
        pendingWithdrawalsTotalAmountMantissa: new BigNumber(0),
      },
      isLoading: false,
    });

    mockUseGetBalanceOf.mockReturnValue({
      data: {
        balanceMantissa: hundredTokensMantissa,
      },
      isLoading: false,
    });

    mockUseGetPrimeToken.mockReturnValue({
      data: {
        exists: false,
      },
      isLoading: false,
    });

    mockUseGetPrimeStatus.mockReturnValue({
      data: {},
      isLoading: false,
    });

    mockUseRequestWithdrawalFromXvsVault.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    });
  });

  it('renders a spinner while data is loading', () => {
    mockUseGetXvsVaultUserInfo.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderRequestWithdrawalForm();

    expect(screen.getByAltText('Spinner')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: submitButtonLabel })).not.toBeInTheDocument();
  });

  it('displays the requestable balance after subtracting active withdrawal requests', () => {
    mockUseGetXvsVaultLockedDeposits.mockReturnValue({
      data: {
        lockedDeposits: [
          {
            amountMantissa: tenTokensMantissa,
            unlockedAt: new Date('2024-01-09T00:00:00.000Z'),
          },
          {
            amountMantissa: tenTokensMantissa,
            unlockedAt: new Date('2024-01-11T00:00:00.000Z'),
          },
        ],
      },
      isLoading: false,
    });

    renderRequestWithdrawalForm();

    expect(screen.getByRole('button', { name: '80 XVS' })).toBeInTheDocument();
  });

  it('shows the Prime loss warning when the entered amount crosses the threshold', async () => {
    mockUseGetPrimeToken.mockReturnValue({
      data: {
        exists: true,
        isIrrevocable: false,
      },
      isLoading: false,
    });

    mockUseGetPrimeStatus.mockReturnValue({
      data: {
        primeMinimumStakedXvsMantissa: oneTokenMantissa.multipliedBy(50),
        xvsVaultPoolId: baseProps.vault.poolIndex,
      },
      isLoading: false,
    });

    mockUseGetXvsVaultUserInfo.mockReturnValue({
      data: {
        stakedAmountMantissa: hundredTokensMantissa,
        pendingWithdrawalsTotalAmountMantissa: tenTokensMantissa,
      },
      isLoading: false,
    });

    renderRequestWithdrawalForm();

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '40' },
    });

    await waitFor(() => expect(screen.getByText(/prime/i)).toBeInTheDocument());
  });

  it('requests a withdrawal and then displays the withdrawal request list', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    const displayWithdrawalRequestList = vi.fn();

    mockUseRequestWithdrawalFromXvsVault.mockReturnValue({
      mutateAsync,
      isPending: false,
    });

    renderRequestWithdrawalForm({
      displayWithdrawalRequestList,
    });

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '25' },
    });

    const form = screen.getByRole('button', { name: submitButtonLabel }).closest('form');

    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        poolIndex: baseProps.vault.poolIndex,
        rewardTokenAddress: baseProps.vault.rewardToken.address,
        amountMantissa: BigInt('25000000000000000000'),
      }),
    );

    await waitFor(() => expect(displayWithdrawalRequestList).toHaveBeenCalledTimes(1));
    expect(mockUseRequestWithdrawalFromXvsVault).toHaveBeenCalledWith({
      waitForConfirmation: true,
    });
  });

  it('opens the withdrawal request list when clicking the secondary action', async () => {
    const displayWithdrawalRequestList = vi.fn();

    renderRequestWithdrawalForm({
      displayWithdrawalRequestList,
    });

    fireEvent.click(screen.getByRole('button', { name: displayWithdrawalRequestListButtonLabel }));

    await waitFor(() => expect(displayWithdrawalRequestList).toHaveBeenCalledTimes(1));
  });
});
