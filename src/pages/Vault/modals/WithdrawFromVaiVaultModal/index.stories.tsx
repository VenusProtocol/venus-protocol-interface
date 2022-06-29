import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withEnabledToken, withAuthContext } from 'stories/decorators';
import WithdrawFromVaiVaultModal, { WithdrawFromVaiVaultModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/WithdrawFromVaiVaultModal',
  component: WithdrawFromVaiVaultModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof WithdrawFromVaiVaultModal>;

const Template: Story<WithdrawFromVaiVaultModalProps> = args => (
  <WithdrawFromVaiVaultModal {...args} />
);

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
  handleClose: noop,
};
Default.decorators = [withAuthContext(authContext), withEnabledToken('vai')];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  handleClose: noop,
};
WithIsInitialLoading.decorators = [withAuthContext(authContext), withEnabledToken('vai')];
