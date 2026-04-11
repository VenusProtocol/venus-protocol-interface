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
import TEST_IDS from '../../TransactionForm/testIds';

const fakeAvailableTokensMantissa = new BigNumber('100000000000000000000');

const fakeVaiVault = fakeVaults[0];
const fakeXvsVault = {
  ...fakeVaults[1],
  poolIndex: 1,
};

describe('StakeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeAvailableTokensMantissa,
      },
      isLoading: false,
    }));

    (useStakeInVault as Mock).mockImplementation(() => ({
      stake: vi.fn().mockResolvedValue(undefined),
      isLoading: false,
    }));
  });

  it('displays the connect wallet state when user is disconnected', async () => {
    const { getByText, queryByTestId } = renderComponent(
      <StakeForm vault={fakeVaiVault} onClose={vi.fn()} />,
    );

    expect(
      getByText(
        en.stakeModal.connectWalletMessage.replace(
          '{{tokenSymbol}}',
          fakeVaiVault.stakedToken.symbol,
        ),
      ),
    ).toBeInTheDocument();
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();
    expect(queryByTestId(TEST_IDS.tokenTextField)).not.toBeInTheDocument();

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

  it('renders a loading state while wallet balance is being fetched', async () => {
    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }));

    const { queryByTestId, queryByText } = renderComponent(
      <StakeForm vault={fakeVaiVault} onClose={vi.fn()} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.tokenTextField)).not.toBeInTheDocument();
    expect(
      queryByText(
        en.stakeModal.availableTokensLabel.replace(
          '{{tokenSymbol}}',
          fakeVaiVault.stakedToken.symbol,
        ),
      ),
    ).not.toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
        token: fakeVaiVault.stakedToken,
      },
      {
        enabled: true,
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

  it('stakes the entered amount and closes the modal on success', async () => {
    const onClose = vi.fn();
    const stake = vi.fn().mockResolvedValue(undefined);

    (useStakeInVault as Mock).mockImplementation(() => ({
      stake,
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(
      <StakeForm vault={fakeXvsVault} onClose={onClose} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: '12' },
    });

    const submitButton = getByText(en.stakeModal.submitButtonLabel).closest('button');

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton as HTMLButtonElement);

    await waitFor(() => expect(stake).toHaveBeenCalledTimes(1));
    expect(stake).toHaveBeenCalledWith({
      amountMantissa: new BigNumber('12000000000000000000'),
      stakedToken: fakeXvsVault.stakedToken,
      rewardToken: fakeXvsVault.rewardToken,
      poolIndex: fakeXvsVault.poolIndex,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
