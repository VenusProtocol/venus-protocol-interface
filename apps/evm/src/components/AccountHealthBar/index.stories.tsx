import type { Meta, StoryObj } from '@storybook/react';

import { AccountHealthBar } from '.';

const meta = {
  title: 'Components/AccountHealthBar',
  component: AccountHealthBar,
  args: {
    borrowBalanceCents: 50000,
    borrowBalanceProtectedCents: 40000,
    borrowLimitCents: 100000,
    borrowLimitProtectedCents: 80000,
    liquidationThresholdCents: 125000,
  },
} satisfies Meta<typeof AccountHealthBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HiddenUserBalances: Story = {
  args: {
    hideUserBalances: '••••',
  },
};
