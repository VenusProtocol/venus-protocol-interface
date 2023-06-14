import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory } from 'stories/decorators';

import { AccountData } from '.';

export default {
  title: 'Components/AccountData',
  component: AccountData,
  decorators: [withCenterStory({ width: 800 })],
} as Meta<typeof AccountData>;

export const SupplyInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="supply"
    amountTokens={new BigNumber(100000)}
  />
);

export const WithdrawInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="withdraw"
    amountTokens={new BigNumber(50)}
  />
);

export const BorrowInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="borrow"
    amountTokens={new BigNumber(100)}
  />
);

export const RepayInfo = () => (
  <AccountData
    asset={poolData[0].assets[3]}
    pool={poolData[0]}
    action="repay"
    amountTokens={new BigNumber(10)}
  />
);
