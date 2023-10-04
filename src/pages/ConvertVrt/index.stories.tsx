import { Meta, StoryFn } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { ChainId } from 'types';

import fakeProvider from '__mocks__/models/provider';
import { AuthContextValue } from 'context/AuthContext';
import { withAuthContext, withCenterStory, withRouter } from 'stories/decorators';

import ConvertVRT, { ConvertVrtUi, ConvertVrtUiProps } from '.';
import ConvertComp from './Convert';
import Withdraw from './Withdraw';

export default {
  title: 'Pages/ConvertVRT',
  component: ConvertVrtUi,
  decorators: [withRouter, withCenterStory({ width: '100vh' })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof ConvertVrtUi>;

const Template: StoryFn<ConvertVrtUiProps> = args => <ConvertVrtUi {...args} />;

const context: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isPrime: false,
  chainId: ChainId.BSC_TESTNET,
  accountAddress: '0x0000000000000000000000000000000000000000',
};

export const ConnectWallet = () => <ConvertVRT />;

export const Enable = Template.bind({});
Enable.decorators = [withAuthContext(context)];
Enable.args = {};

export const ConvertTab = () => <ConvertComp />;

ConvertTab.decorators = [withAuthContext(context)];

export const WithdrawTab = () => (
  <Withdraw
    xvsWithdrawableAmount={new BigNumber(9999)}
    withdrawXvs={noop}
    withdrawXvsLoading={false}
  />
);
