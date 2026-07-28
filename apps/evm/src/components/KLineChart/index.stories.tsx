import type { Meta, StoryObj } from '@storybook/react';
import type { DataLoader } from 'klinecharts';
import noop from 'noop-ts';

import { ApiOhlcInterval } from 'types';
import { KLineChart } from '.';

const dataLoader: DataLoader = {
  getBars: async ({ callback }) => {
    callback(
      [
        { timestamp: 1721606400000, open: 100, high: 112, low: 98, close: 108, volume: 1200 },
        { timestamp: 1721692800000, open: 108, high: 115, low: 104, close: 110, volume: 950 },
        { timestamp: 1721779200000, open: 110, high: 118, low: 107, close: 116, volume: 1320 },
      ],
      { backward: false, forward: false },
    );
  },
};

const meta = {
  title: 'Components/KLineChart',
  component: KLineChart,
  args: {
    title: 'USDC/XVS',
    interval: ApiOhlcInterval['1d'],
    onIntervalChange: noop,
    dataLoader,
    pricePrecision: 2,
    className: 'h-80',
  },
  render: args => (
    <div className="h-96 max-w-3xl">
      <KLineChart {...args} />
    </div>
  ),
} satisfies Meta<typeof KLineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
