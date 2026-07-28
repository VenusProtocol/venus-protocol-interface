import type { Meta, StoryObj } from '@storybook/react';

import { PageStatHeader } from '.';

const meta = {
  title: 'Components/PageStatHeader',
  component: PageStatHeader,
  args: {
    title: 'Market stats',
    description: 'Overview of deterministic market statistics.',
    cells: [
      { label: 'Total supply', value: '$1.2M' },
      { label: 'Total borrow', value: '$680K' },
      { label: 'Available liquidity', value: '$520K' },
    ],
  },
} satisfies Meta<typeof PageStatHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
