import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useExecuteWithdrawalFromXvsVault, useGetXvsVaultLockedDeposits } from 'clients/api';
import { en } from 'libs/translations';

import { ChainId, chainMetadata } from '@venusprotocol/chains';
import { lockedDeposits } from '__mocks__/models/vaults';
import Withdraw from '.';
import TEST_IDS from './testIds';

const fakePoolIndex = 6;
const fakeStakedToken = vai;

describe('Withdraw', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date(1656603774626));
    (useGetXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        lockedDeposits,
      },
    }));
  });

  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton));
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { queryByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
    );

    // Check connect button is present
    await waitFor(() => expect(queryByText(en.connectWallet.connectButton)).toBeInTheDocument());
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { queryByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
        accountChainId: ChainId.SEPOLIA,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    // Check switch button is present
    await waitFor(() =>
      expect(
        queryByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[ChainId.BSC_TESTNET].name,
          ),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('fetches available tokens amount and displays it correctly', async () => {
    const { getByTestId } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot();
  });

  it('disables submit button when there is no tokens available', async () => {
    (useGetXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        lockedDeposits: [],
      },
    }));

    const { getByTestId, getByText } = renderComponent(
      <Withdraw poolIndex={fakePoolIndex} stakedToken={fakeStakedToken} handleClose={noop} />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton,
    ).closest('button') as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('lets user withdraw their available tokens and calls handleClose callback on success', async () => {
    const mockExecuteWithdrawalFromXvsVault = vi.fn();
    (useExecuteWithdrawalFromXvsVault as Mock).mockImplementation(() => ({
      mutateAsync: mockExecuteWithdrawalFromXvsVault,
    }));

    const handleCloseMock = vi.fn();

    const { getByTestId, getByText } = renderComponent(
      <Withdraw
        poolIndex={fakePoolIndex}
        stakedToken={fakeStakedToken}
        handleClose={handleCloseMock}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const submitButton = getByText(
      en.withdrawFromVestingVaultModalModal.withdrawTab.submitButton,
    ).closest('button') as HTMLButtonElement;

    // Click on submit button
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeEnabled());
    await waitFor(() => expect(mockExecuteWithdrawalFromXvsVault).toHaveBeenCalledTimes(1));
    expect(mockExecuteWithdrawalFromXvsVault).toHaveBeenCalledWith({
      poolIndex: fakePoolIndex,
      rewardTokenAddress: xvs.address,
    });

    await waitFor(() => expect(handleCloseMock).toHaveBeenCalledTimes(1));
  });
});
