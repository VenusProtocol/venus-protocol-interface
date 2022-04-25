import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { AccountHealth } from '.';

export default {
  title: 'Components/AccountHealth',
  component: AccountHealth,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof AccountHealth>;

export const Default = () => (
  <AccountHealth
    borrowBalanceCents={30243}
    borrowLimitCents={737300}
    safeBorrowLimitPercentage={80}
  />
);
