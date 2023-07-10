import { Meta, StoryFn } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { TOKENS } from 'constants/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import ActionModal, { ActionModalProps } from '.';

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
  accountAddress: fakeAddress,
};

export const Default = Template.bind({});
Default.args = {
  token: TOKENS.vai,
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
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiController'),
  }),
];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  token: TOKENS.vai,
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
  token: TOKENS.vai,
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
  token: TOKENS.vai,
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
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiController'),
  }),
];
