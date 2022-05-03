import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta, Story } from '@storybook/react';
import { withAuthContext, withCenterStory, withRouter, withProvider } from 'stories/decorators';
import ConvertVRT, { ConvertVrtUi, ConvertVrtUiProps } from '.';
import Withdraw from './Withdraw';

export default {
  title: 'Pages/ConvertVRT',
  component: ConvertVrtUi,
  decorators: [withRouter, withProvider, withCenterStory({ width: '100vh' })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof ConvertVrtUi>;

const Template: Story<ConvertVrtUiProps> = args => <ConvertVrtUi {...args} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const ConnectWallet = () => <ConvertVRT />;

export const Convert = Template.bind({});
Convert.decorators = [withAuthContext(context)];
Convert.args = {
  xvsTotalWei: new BigNumber('120497'),
  xvsToVrtRate: new BigNumber('0.000083'),
  vrtLimitUsedWei: new BigNumber(300),
  vrtLimitWei: new BigNumber(1000),
  vrtConversionEndTime: '1678859525',
};

export const WithdrawTab = () => <Withdraw xvsTotal={new BigNumber(9999)} />;
