import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { AccountHealth, PrimaryAccountHealth, SecondaryAccountHealth } from '.';

export default {
  title: 'Components/AccountHealth',
  component: AccountHealth,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof AccountHealth>;

export const Primary = () => (
  <PrimaryAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const Secondary = () => (
  <SecondaryAccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);

export const WithZeroValues = () => (
  <AccountHealth borrowBalanceCents={0} borrowLimitCents={0} safeBorrowLimitPercentage={80} />
);

export const WithUndefinedValues = () => (
  <AccountHealth
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeBorrowLimitPercentage={80}
  />
);
