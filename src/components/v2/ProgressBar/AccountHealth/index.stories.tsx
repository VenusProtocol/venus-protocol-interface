import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { AccountHealth, BorrowBalanceAccountHealth, BorrowLimitUsedAccountHealth } from '.';

export default {
  title: 'Components/ProgressBar/AccountHealth',
  component: AccountHealth,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof AccountHealth>;

export const Primary = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const Secondary = () => (
  <BorrowLimitUsedAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const WithZeroValues = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={0}
    borrowLimitCents={0}
    safeBorrowLimitPercentage={80}
  />
);

export const WithUndefinedValues = () => (
  <BorrowBalanceAccountHealth
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeBorrowLimitPercentage={80}
  />
);
