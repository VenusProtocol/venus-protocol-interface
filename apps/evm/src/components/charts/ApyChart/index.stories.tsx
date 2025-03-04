import type { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { ApyChart, type ApyChartItem, BorrowApyChart, SupplyApyChart } from '.';

const data: ApyChartItem[] = [
  {
    apyPercentage: 40,
    timestampMs: new Date('2022-05-03T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(10000),
  },
  {
    apyPercentage: 30,
    timestampMs: new Date('2022-05-04T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(10000000),
  },
  {
    apyPercentage: 20,
    timestampMs: new Date('2022-05-05T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(100000),
  },
  {
    apyPercentage: 27,
    timestampMs: new Date('2022-05-06T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(100000),
  },
  {
    apyPercentage: 18,
    timestampMs: new Date('2022-05-07T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(10000000000),
  },
  {
    apyPercentage: 23,
    timestampMs: new Date('2022-05-08T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(10000000),
  },
  {
    apyPercentage: 34,
    timestampMs: new Date('2022-05-09T10:59:44.330Z').getTime(),
    balanceCents: new BigNumber(100000),
  },
];

export default {
  title: 'Components/charts/ApyChart',
  component: ApyChart,
} as Meta<typeof ApyChart>;

export const SupplyAPY = () => <SupplyApyChart data={data} selectedPeriod="year" />;
export const BorrowAPY = () => <BorrowApyChart data={data} selectedPeriod="year" />;
