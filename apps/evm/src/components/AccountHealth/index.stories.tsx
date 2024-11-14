import type { Meta, StoryObj } from '@storybook/react';

import { AccountHealth } from '.';

export default {
  title: 'Components/AccountHealth',
  component: AccountHealth,
  args: {
    borrowBalanceCents: 30243,
    borrowLimitCents: 737300,
    safeBorrowLimitPercentage: 80,
    variant: 'borrowBalance',
  },
} as Meta<typeof AccountHealth>;

type Story = StoryObj<typeof AccountHealth>;

export const Default: Story = {};
