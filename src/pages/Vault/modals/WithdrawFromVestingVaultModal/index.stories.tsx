import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { vXvs } from '__mocks__/models/vTokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import WithdrawFromVestingVaultModal, { WithdrawFromVestingVaultModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/WithdrawFromVestingVaultModal',
  component: WithdrawFromVestingVaultModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof WithdrawFromVestingVaultModal>;

const Template: StoryFn<WithdrawFromVestingVaultModalProps> = args => (
  <WithdrawFromVestingVaultModal {...args} />
);

const authContext: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  accountAddress: fakeAddress,
  chainId: ChainId.BSC_TESTNET,
};

export const Default = Template.bind({});
Default.args = {
  handleClose: noop,
  stakedToken: vXvs.underlyingToken,
};
Default.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vXvs.underlyingToken,
    accountAddress: fakeAddress,
    spenderAddress: vXvs.address,
  }),
];
