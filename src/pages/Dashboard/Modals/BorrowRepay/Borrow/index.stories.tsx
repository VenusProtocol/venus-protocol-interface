import React from 'react';
import BigNumber from 'bignumber.js';

import { ComponentMeta } from '@storybook/react';
import { assetData } from '__mocks__/models/asset';
import { withCenterStory } from 'stories/decorators';
import { BorrowForm } from '.';

export default {
  title: 'Pages/Dashboard/Modals/BorrowRepay/BorrowForm',
  component: BorrowForm,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowForm>;

export const Default = () => (
  <BorrowForm
    limitTokens="100000"
    safeLimitTokens="11730.907986355233479"
    borrow={async () => 'fake-transaction-hash'}
    asset={assetData[0]}
    isBorrowLoading={false}
    safeBorrowLimitPercentage={80}
    totalBorrowBalanceCents={new BigNumber('100000')}
    borrowLimitCents={new BigNumber('2000000')}
    calculateDailyEarningsCents={tokenAmount => new BigNumber('100').plus(tokenAmount)}
  />
);
