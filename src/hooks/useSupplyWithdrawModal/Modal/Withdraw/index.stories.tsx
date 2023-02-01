import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import fakeProvider from '__mocks__/models/provider';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import { WithdrawUi, WithdrawUiProps } from '.';

export default {
  title: 'Modals/Withdraw',
  component: WithdrawUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof WithdrawUi>;

const Template: Story<WithdrawUiProps> = args => <WithdrawUi {...args} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isReconnecting: false,
  account: {
    address: fakeAddress,
  },
};

export const DisconnectedWithdraw = Template.bind({});
DisconnectedWithdraw.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};

export const DisabledWithdraw = Template.bind({});
DisabledWithdraw.decorators = [withAuthContext(context)];
DisabledWithdraw.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};

export const Withdraw = Template.bind({});
Withdraw.decorators = [
  withAuthContext(context),
  withEnabledToken({
    token: poolData[0].assets[0].vToken.underlyingToken,
    accountAddress: fakeAddress,
    spenderAddress: poolData[0].assets[0].vToken.address,
  }),
];

Withdraw.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};
