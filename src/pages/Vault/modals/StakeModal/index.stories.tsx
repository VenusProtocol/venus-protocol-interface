import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { TOKENS } from 'constants/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import StakeModal, { StakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/StakeModal',
  component: StakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof StakeModal>;

const Template: StoryFn<StakeModalProps> = args => <StakeModal {...args} />;

const authContext: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isConnected: true,
  accountAddress: fakeAddress,
};

export const Default = Template.bind({});
Default.args = {
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  handleClose: noop,
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
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  handleClose: noop,
};
WithIsInitialLoading.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiController'),
  }),
];
