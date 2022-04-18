import React from 'react';
import { BigNumber } from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withAuthContext } from 'stories/decorators';
import { assetData } from '__mocks__/models/asset';
import { SupplyWithdrawUi, ISupplyWithdrawUiProps } from '.';

export default {
  title: 'Pages/Dashboard/SupplyWithdraw',
  component: SupplyWithdrawUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SupplyWithdrawUi>;

const Template: Story<ISupplyWithdrawUiProps> = args => <SupplyWithdrawUi {...args} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const DisconnectedSupply = Template.bind({});
DisconnectedSupply.args = {
  asset: assetData[0],
  onClose: noop,
  userTotalBorrowBalance: new BigNumber('16'),
  userTotalBorrowLimit: new BigNumber('42.38'),
  dailyEarnings: new BigNumber('238'),
};

export const DisabledSupply = Template.bind({});
DisabledSupply.decorators = [withAuthContext(context)];
DisabledSupply.args = {
  asset: { ...assetData[0], isEnabled: false },
  onClose: noop,
  userTotalBorrowBalance: new BigNumber('16'),
  userTotalBorrowLimit: new BigNumber('42.38'),
  dailyEarnings: new BigNumber('238'),
};

export const Supply = Template.bind({});
Supply.decorators = [withAuthContext(context)];
Supply.args = {
  asset: assetData[0],
  onClose: noop,
  userTotalBorrowBalance: new BigNumber('16'),
  userTotalBorrowLimit: new BigNumber('42.38'),
  dailyEarnings: new BigNumber('238'),
};
