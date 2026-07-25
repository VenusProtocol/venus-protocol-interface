import type { Meta, StoryObj } from '@storybook/react';

import { MarketStatus } from '.';

const meta = {
  title: 'Components/MarketStatus',
  component: MarketStatus,
  args: {
    canBeCollateral: true,
    isBorrowable: true,
  },
} satisfies Meta<typeof MarketStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Available: Story = {};

export const NotBorrowable: Story = {
  args: {
    isBorrowable: false,
  },
};

export const NotCollateral: Story = {
  args: {
    canBeCollateral: false,
  },
};
