import type { Meta, StoryObj } from '@storybook/react';

import { MarketCard } from '.';

const meta = {
  title: 'Components/MarketCard',
  component: MarketCard,
  args: {
    title: 'USDC Market',
    cells: [
      { label: 'Total supply', value: '$1.2M' },
      { label: 'Total borrow', value: '$680K' },
      { label: 'Liquidity', value: '$520K' },
    ],
    legends: [
      { label: 'Supply APY', color: 'green' },
      { label: 'Borrow APY', color: 'red' },
    ],
    children: <div className="h-32 rounded-lg bg-dark-blue" />,
  },
} satisfies Meta<typeof MarketCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRightContent: Story = {
  args: {
    rightContent: <span className="text-grey text-sm">Updated 5 minutes ago</span>,
  },
};
