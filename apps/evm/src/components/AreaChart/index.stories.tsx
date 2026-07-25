import type { Meta, StoryObj } from '@storybook/react';
import { theme } from '@venusprotocol/ui';

import { AreaChart } from '.';

const data = [
  { date: 'Jan', value: 20 },
  { date: 'Feb', value: 38 },
  { date: 'Mar', value: 30 },
  { date: 'Apr', value: 48 },
  { date: 'May', value: 44 },
  { date: 'Jun', value: 62 },
];

const meta = {
  title: 'Components/AreaChart',
  component: AreaChart,
  args: {
    data,
    xAxisDataKey: 'date',
    yAxisDataKey: 'value',
    chartColor: theme.colors.green,
    formatXAxisValue: value => value,
    formatYAxisValue: value => `$${value}`,
    formatTooltipItems: value => [
      {
        label: 'Value',
        value: `$${value.value}`,
      },
    ],
  },
} satisfies Meta<typeof AreaChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAxes: Story = {
  args: {
    displayAxes: false,
  },
};
