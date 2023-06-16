import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import WithdrawFromVestingVaultModal, { WithdrawFromVestingVaultModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/WithdrawFromVestingVaultModal',
  component: WithdrawFromVestingVaultModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof WithdrawFromVestingVaultModal>;

const Template: Story<WithdrawFromVestingVaultModalProps> = args => (
  <WithdrawFromVestingVaultModal {...args} />
);

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
  handleClose: noop,
  stakedToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'].underlyingToken,
};
Default.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'].underlyingToken,
    accountAddress: fakeAddress,
    spenderAddress: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'].address,
  }),
];
