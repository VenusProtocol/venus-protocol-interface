import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withEnabledToken, withAuthContext } from 'stories/decorators';
import NonVestingVaultStakeModal, { NonVestingVaultStakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/NonVestingVaultStakeModal',
  component: NonVestingVaultStakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof NonVestingVaultStakeModal>;

const Template: Story<NonVestingVaultStakeModalProps> = args => (
  <NonVestingVaultStakeModal {...args} />
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
  tokenId: 'vai',
  handleClose: noop,
};
Default.decorators = [withAuthContext(authContext), withEnabledToken('vai')];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  tokenId: 'vai',
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  tokenId: 'vai',
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  tokenId: 'vai',
  handleClose: noop,
};
WithIsInitialLoading.decorators = [withAuthContext(authContext), withEnabledToken('vai')];
