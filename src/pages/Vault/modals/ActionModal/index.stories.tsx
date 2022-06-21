import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withEnabledToken, withAuthContext } from 'stories/decorators';
import ActionModal, { IActionModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/ActionModal',
  component: ActionModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof ActionModal>;

const Template: Story<IActionModalProps> = args => <ActionModal {...args} />;

const authContext = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const Default = Template.bind({});
Default.args = {
  tokenId: 'vai',
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
Default.decorators = [withAuthContext(authContext), withEnabledToken('vai')];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  tokenId: 'vai',
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
  tokenId: 'vai',
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
  tokenNeedsToBeEnabled: true,
  enableTokenMessage: 'Enable VAI to proceed',
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  tokenId: 'vai',
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
WithIsInitialLoading.decorators = [withAuthContext(authContext), withEnabledToken('vai')];
