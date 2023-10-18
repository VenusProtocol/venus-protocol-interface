import { Meta, StoryFn } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { getVaiControllerContractAddress } from 'packages/contracts';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { vai } from '__mocks__/models/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import ActionModal, { ActionModalProps } from '.';

const VAI_CONTROLLER_CONTRACT_ADDRESS = getVaiControllerContractAddress({
  chainId: ChainId.BSC_TESTNET,
})!;

export default {
  title: 'Pages/Vault/modals/ActionModal',
  component: ActionModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof ActionModal>;

const Template: StoryFn<ActionModalProps> = args => <ActionModal {...args} />;

const authContext: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isPrime: false,
  chainId: ChainId.BSC_TESTNET,
  accountAddress: fakeAddress,
};

export const Default = Template.bind({});
Default.args = {
  token: vai,
  handleClose: noop,
  isInitialLoading: false,
  isSubmitting: false,
  title: 'Stake VAI',
  availableTokensWei: new BigNumber('100000000000000000000'),
  availableTokensLabel: 'Available VAI',
  onSubmit: noop,
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
  connectWalletMessage: 'Please connect your wallet to stake',
};
Default.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  token: vai,
  handleClose: noop,
  isInitialLoading: false,
  isSubmitting: false,
  title: 'Stake VAI',
  availableTokensWei: new BigNumber('100000000000000000000'),
  availableTokensLabel: 'Available VAI',
  onSubmit: noop,
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
  connectWalletMessage: 'Please connect your wallet to stake',
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  token: vai,
  handleClose: noop,
  isInitialLoading: false,
  isSubmitting: false,
  title: 'Stake VAI',
  availableTokensWei: new BigNumber('100000000000000000000'),
  availableTokensLabel: 'Available VAI',
  onSubmit: noop,
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
  connectWalletMessage: 'Please connect your wallet to stake',
  tokenNeedsToBeApproved: true,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  token: vai,
  handleClose: noop,
  isInitialLoading: true,
  isSubmitting: false,
  title: 'Stake VAI',
  availableTokensWei: new BigNumber('100000000000000000000'),
  availableTokensLabel: 'Available VAI',
  onSubmit: noop,
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
  connectWalletMessage: 'Please connect your wallet to stake',
};
WithIsInitialLoading.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];
