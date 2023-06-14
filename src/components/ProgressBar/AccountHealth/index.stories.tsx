import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { AccountHealth, BorrowBalanceAccountHealth, BorrowLimitUsedAccountHealth } from '.';

export default {
  title: 'Components/ProgressBar/AccountHealth',
  component: AccountHealth,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof AccountHealth>;

export const BorrowBalanceAccountHealthWithValues = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const BorrowLimitUsedAccountHealthWithValues = () => (
  <BorrowLimitUsedAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const BorrowBalanceAccountHealthWithZeroValues = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={0}
    borrowLimitCents={0}
    safeBorrowLimitPercentage={80}
  />
);

export const BorrowBalanceAccountHealthWithUndefinedValues = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeBorrowLimitPercentage={80}
  />
);
