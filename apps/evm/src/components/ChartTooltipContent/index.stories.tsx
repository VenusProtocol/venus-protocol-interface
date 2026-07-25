import type { Meta, StoryObj } from '@storybook/react';

import { ChartTooltipContent } from '.';

const meta = {
  title: 'Components/ChartTooltipContent',
  component: ChartTooltipContent,
  args: {
    items: [
      { label: 'Supply APY', value: '4.2%' },
      { label: 'Borrow APY', value: '6.8%' },
    ],
  },
} satisfies Meta<typeof ChartTooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
