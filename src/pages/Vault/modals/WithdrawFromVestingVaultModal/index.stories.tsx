import React from 'react';
import noop from 'noop-ts';

import fakeAddress from '__mocks__/models/address';
import { getVBepToken } from 'utilities';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withEnabledToken, withAuthContext } from 'stories/decorators';
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
    address: fakeAddress,
  },
};

export const Default = Template.bind({});
Default.args = {
  handleClose: noop,
  stakedTokenId: 'xvs',
};
Default.decorators = [
  withAuthContext(authContext),
  withEnabledToken({
    tokenId: 'xvs',
    accountAddress: fakeAddress,
    spenderAddress: getVBepToken('xvs').address,
  }),
];
