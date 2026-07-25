import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { AvailableBalance } from '.';

const meta = {
  title: 'Components/AvailableBalance',
  component: AvailableBalance,
  args: {
    readableBalance: '1,234.56 USDC',
    onClick: noop,
  },
} satisfies Meta<typeof AvailableBalance>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    onClick: undefined,
  },
};
