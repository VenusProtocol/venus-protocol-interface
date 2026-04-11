import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import {
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultLockedDeposits,
  useGetXvsVaultUserInfo,
  useRequestWithdrawalFromXvsVault,
} from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { RequestWithdrawalForm, type RequestWithdrawalFormProps } from '..';
import TEST_IDS from '../../../../TransactionForm/testIds';

const baseProps: RequestWithdrawalFormProps = {
  poolIndex: 1,
  stakedToken: xvs,
  rewardToken: vai,
  lockingPeriodMs: 1000 * 60 * 60 * 24 * 3,
  displayWithdrawalRequestList: vi.fn(),
};

const oneTokenMantissa = new BigNumber('1000000000000000000');
const hundredTokensMantissa = oneTokenMantissa.multipliedBy(100);
const tenTokensMantissa = oneTokenMantissa.multipliedBy(10);

describe('RequestWithdrawalForm', () => {
  const mockUseGetXvsVaultLockedDeposits = useGetXvsVaultLockedDeposits as Mock;
  const mockUseGetXvsVaultUserInfo = useGetXvsVaultUserInfo as Mock;
  const mockUseGetPrimeToken = useGetPrimeToken as Mock;
  const mockUseGetPrimeStatus = useGetPrimeStatus as Mock;
  const mockUseRequestWithdrawalFromXvsVault = useRequestWithdrawalFromXvsVault as Mock;

  const renderRequestWithdrawalForm = (props: Partial<RequestWithdrawalFormProps> = {}) =>
    renderComponent(<RequestWithdrawalForm {...baseProps} {...props} />, {
      accountAddress: fakeAccountAddress,
    });

  beforeEach(() => {
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

    const { getByAltText, queryByRole } = renderRequestWithdrawalForm();

    expect(getByAltText('Spinner')).toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonLabel,
      }),
    ).not.toBeInTheDocument();
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
            unlockedAt: new Date('2024-01-10T00:00:00.000Z'),
          },
        ],
      },
      isLoading: false,
    });

    const { getByTestId } = renderRequestWithdrawalForm();

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toBe('Requestable XVS80 XVS');
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
        xvsVaultPoolId: baseProps.poolIndex,
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

    const { getByTestId, getByText } = renderRequestWithdrawalForm();

    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: '40' },
    });

    await waitFor(() =>
      expect(
        getByText(
          en.requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.primeLossWarning
            .submitButtonLabel,
        ),
      ).toBeInTheDocument(),
    );

    expect(getByText(/You will lose your Prime token/i)).toBeInTheDocument();
  });

  it('requests a withdrawal and then displays the withdrawal request list', async () => {
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    const displayWithdrawalRequestList = vi.fn();

    mockUseRequestWithdrawalFromXvsVault.mockReturnValue({
      mutateAsync,
      isPending: false,
    });

    const { getByRole, getByTestId } = renderRequestWithdrawalForm({
      displayWithdrawalRequestList,
    });

    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: '25' },
    });

    fireEvent.click(
      getByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonLabel,
      }),
    );

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        poolIndex: baseProps.poolIndex,
        rewardTokenAddress: baseProps.rewardToken.address,
        amountMantissa: BigInt('25000000000000000000'),
      }),
    );

    await waitFor(() => expect(displayWithdrawalRequestList).toHaveBeenCalledTimes(1));
  });

  it('opens the withdrawal request list when clicking the secondary action', async () => {
    const displayWithdrawalRequestList = vi.fn();
    const { getByRole } = renderRequestWithdrawalForm({
      displayWithdrawalRequestList,
    });

    fireEvent.click(
      getByRole('button', {
        name: en.requestWithdrawalFromVestingVaultForm.requestWithdrawalTab
          .displayWithdrawalRequestListButton,
      }),
    );

    await waitFor(() => expect(displayWithdrawalRequestList).toHaveBeenCalledTimes(1));
  });
});
