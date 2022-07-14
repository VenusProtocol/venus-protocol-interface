import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import WithdrawFromVestingVaultModal, { WithdrawFromVestingVaultModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/WithdrawFromVestingVaultModal',
  component: WithdrawFromVestingVaultModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof WithdrawFromVestingVaultModal>;

const Template: Story<WithdrawFromVestingVaultModalProps> = args => (
  <WithdrawFromVestingVaultModal {...args} />
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
  stakedTokenId: 'xvs',
};
Default.decorators = [withAuthContext(authContext), withEnabledToken('xvs')];
