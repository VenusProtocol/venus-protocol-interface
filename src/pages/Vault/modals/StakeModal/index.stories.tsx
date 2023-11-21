import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import { getVaiControllerContractAddress } from 'packages/contracts';
import React from 'react';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { vai, xvs } from '__mocks__/models/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import StakeModal, { StakeModalProps } from '.';

const VAI_CONTROLLER_CONTRACT_ADDRESS = getVaiControllerContractAddress({
  chainId: ChainId.BSC_TESTNET,
})!;

export default {
  title: 'Pages/Vault/modals/StakeModal',
  component: StakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof StakeModal>;

const Template: StoryFn<StakeModalProps> = args => <StakeModal {...args} />;

const authContext: AuthContextValue = {
  logIn: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  switchChain: noop,
  provider: fakeProvider,
  chainId: ChainId.BSC_TESTNET,
  accountAddress: fakeAddress,
};

export const Default = Template.bind({});
Default.args = {
  stakedToken: vai,
  rewardToken: xvs,
  handleClose: noop,
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
  stakedToken: vai,
  rewardToken: xvs,
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  stakedToken: vai,
  rewardToken: xvs,
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  stakedToken: vai,
  rewardToken: xvs,
  handleClose: noop,
};
WithIsInitialLoading.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];
