import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import StakeModal, { StakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/StakeModal',
  component: StakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof StakeModal>;

const Template: Story<StakeModalProps> = args => <StakeModal {...args} />;

const authContext = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: fakeAddress,
  },
};

export const Default = Template.bind({});
Default.args = {
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  handleClose: noop,
};
Default.decorators = [
  withAuthContext(authContext),
  withEnabledToken({
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiUnitroller'),
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
  withEnabledToken({
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiUnitroller'),
  }),
];
