import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withEnabledToken, withAuthContext } from 'stories/decorators';
import StakeModal, { IStakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/StakeModal',
  component: StakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof StakeModal>;

const Template: Story<IStakeModalProps> = args => <StakeModal {...args} />;

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
  stakedTokenId: 'vai',
  rewardTokenId: 'xvs',
  handleClose: noop,
};
Default.decorators = [withAuthContext(authContext), withEnabledToken('vai')];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  stakedTokenId: 'vai',
  rewardTokenId: 'xvs',
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  stakedTokenId: 'vai',
  rewardTokenId: 'xvs',
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  stakedTokenId: 'vai',
  rewardTokenId: 'xvs',
  handleClose: noop,
};
WithIsInitialLoading.decorators = [withAuthContext(authContext), withEnabledToken('vai')];
