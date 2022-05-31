import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta, Story } from '@storybook/react';
import { withAuthContext, withCenterStory, withRouter, withProvider } from 'stories/decorators';
import ConvertVRT, { ConvertVrtUi, ConvertVrtUiProps } from '.';
import Withdraw from './Withdraw';
import ConvertComp from './Convert';

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

export const Enable = Template.bind({});
Enable.decorators = [withAuthContext(context)];
Enable.args = {
  xvsToVrtConversionRatio: new BigNumber('0.000083'),
  vrtConversionEndTime: new Date('1678859525'),
};

export const ConvertTab = () => (
  <ConvertComp
    xvsToVrtConversionRatio={new BigNumber(0.000006333)}
    vrtConversionEndTime={new Date(Date.now() + 60 * 60 * 24 * 3)}
    userVrtBalanceWei={new BigNumber(33333)}
    convertVrtLoading={false}
    convertVrt={noop}
  />
);
ConvertTab.decorators = [withAuthContext(context)];

export const WithdrawTab = () => (
  <Withdraw
    xvsWithdrawableAmount={new BigNumber(9999)}
    withdrawXvs={noop}
    withdrawXvsLoading={false}
  />
);
