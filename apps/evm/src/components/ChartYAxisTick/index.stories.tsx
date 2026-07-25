import type { Meta, StoryObj } from '@storybook/react';

import { ChartYAxisTick } from '.';

const meta = {
  title: 'Components/ChartYAxisTick',
  component: ChartYAxisTick,
  args: {
    value: '$1,000',
    y: 20,
  },
  render: args => (
    <svg width="120" height="40">
      <ChartYAxisTick {...args} />
    </svg>
  ),
} satisfies Meta<typeof ChartYAxisTick>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
