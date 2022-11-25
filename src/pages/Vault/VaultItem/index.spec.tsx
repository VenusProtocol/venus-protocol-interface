import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { vaults as fakeVaults } from '__mocks__/models/vaults';
import { withdrawFromVrtVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import useClaimVaultReward from 'hooks/useClaimVaultReward';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import VaultItem, { VaultItemProps } from '.';
import TEST_IDS from './testIds';

jest.mock('clients/api');
jest.mock('hooks/useClaimVaultReward');
jest.mock('hooks/useSuccessfulTransactionModal');

const fakeVault = fakeVaults[0];

const baseProps: VaultItemProps = {
  ...fakeVault,
  userPendingRewardWei: new BigNumber('100000000000000000000'),
  userStakedWei: new BigNumber('200000000000000000000'),
};

describe('pages/Vault/VaultItem', () => {
  it('renders without crashing', async () => {
    renderComponent(<VaultItem {...baseProps} />);
  });

  it('renders vault correctly', async () => {
    const { getByTestId, getAllByTestId } = renderComponent(<VaultItem {...baseProps} />);

    const symbolElement = getByTestId(TEST_IDS.symbol);
    const userPendingRewardTokensElement = getByTestId(TEST_IDS.userPendingRewardTokens);
    const userStakedTokensElement = getByTestId(TEST_IDS.userStakedTokens);
    const dataListItemElements = getAllByTestId(TEST_IDS.dataListItem);

    expect(symbolElement.textContent).toMatchSnapshot();
    expect(userPendingRewardTokensElement.textContent).toMatchSnapshot();
    expect(userStakedTokensElement.textContent).toMatchSnapshot();

    dataListItemElements.map(dataListItemElement =>
      expect(dataListItemElement.textContent).toMatchSnapshot(),
    );
  });

  it('hides withdraw button when displaying non-vesting VRT vault and userStakedWei is equal to 0', async () => {
    const customBaseProps: VaultItemProps = {
      ...baseProps,
      stakedToken: TOKENS.vrt,
      userStakedWei: new BigNumber(0),
    };

    const { queryByText } = renderComponent(<VaultItem {...customBaseProps} />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    // Click on withdraw button
    expect(queryByText(en.vaultItem.withdrawButton)).toBeNull();
  });

  it('sends the correct request then displays a successful transaction modal on success when clicking on the claim reward button', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    const { claimReward } = useClaimVaultReward();

    (claimReward as jest.Mock).mockImplementationOnce(() => fakeTransactionReceipt);

    const { getByText } = renderComponent(<VaultItem {...baseProps} />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    // Click on claim reward button
    const claimRewardButton = getByText(en.vaultItem.claimButton);
    fireEvent.click(claimRewardButton);

    await waitFor(() => expect(claimReward).toHaveBeenCalledTimes(1));
    expect(claimReward).toHaveBeenCalledWith({
      accountAddress: fakeAddress,
      poolIndex: baseProps.poolIndex,
      rewardToken: baseProps.rewardToken,
      stakedToken: baseProps.stakedToken,
    });

    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      content: en.vaultItem.successfulClaimRewardTransactionModal.description,
      title: en.vaultItem.successfulClaimRewardTransactionModal.title,
    });
  });

  it('sends the correct request then displays a successful transaction modal on success when clicking on the withdraw button of the VRT non-vesting vault', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (withdrawFromVrtVault as jest.Mock).mockImplementationOnce(() => fakeTransactionReceipt);

    const customBaseProps: VaultItemProps = {
      ...baseProps,
      stakedToken: TOKENS.vrt,
    };

    const { getByText } = renderComponent(<VaultItem {...customBaseProps} />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    // Click on withdraw button
    const withdrawButton = getByText(en.vaultItem.withdrawButton);
    fireEvent.click(withdrawButton);

    await waitFor(() => expect(withdrawFromVrtVault).toHaveBeenCalledTimes(1));
    expect(withdrawFromVrtVault).toHaveBeenCalledWith({
      fromAccountAddress: fakeAddress,
    });

    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeTransactionReceipt.transactionHash,
      content: en.vaultItem.successfulWithdrawVrtTransactionModal.description,
      title: en.vaultItem.successfulWithdrawVrtTransactionModal.title,
    });
  });
});
