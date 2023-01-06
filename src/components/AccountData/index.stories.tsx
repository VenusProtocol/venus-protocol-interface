import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory } from 'stories/decorators';

import { AccountData } from '.';

export default {
  title: 'Components/AccountData',
  component: AccountData,
  decorators: [withCenterStory({ width: 800 })],
} as ComponentMeta<typeof AccountData>;

export const SupplyInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="supply"
    amountTokens={new BigNumber(1000000)}
  />
);

export const WithdrawInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="withdraw"
    amountTokens={new BigNumber(10000)}
  />
);

export const BorrowInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="borrow"
    amountTokens={new BigNumber(1000)}
  />
);

export const RepayInfo = () => (
  <AccountData
    asset={poolData[0].assets[0]}
    pool={poolData[0]}
    action="repay"
    amountTokens={new BigNumber(1000)}
  />
);
