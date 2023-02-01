import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import fakeProvider from '__mocks__/models/provider';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import { SupplyUi, SupplyUiProps } from '.';

export default {
  title: 'Modals/Supply',
  component: SupplyUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SupplyUi>;

const Template: Story<SupplyUiProps> = args => <SupplyUi {...args} />;

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

export const DisconnectedSupply = Template.bind({});
DisconnectedSupply.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};

export const DisabledSupply = Template.bind({});
DisabledSupply.decorators = [withAuthContext(context)];
DisabledSupply.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};

export const Supply = Template.bind({});
Supply.decorators = [
  withAuthContext(context),
  withEnabledToken({
    token: poolData[0].assets[0].vToken.underlyingToken,
    accountAddress: fakeAddress,
    spenderAddress: poolData[0].assets[0].vToken.address,
  }),
];

Supply.args = {
  asset: poolData[0].assets[0],
  pool: poolData[0],
  onSubmit: noop,
  isLoading: false,
  onClose: noop,
};
