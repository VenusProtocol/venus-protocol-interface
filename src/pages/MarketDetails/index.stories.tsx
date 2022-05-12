import React from 'react';
import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { IApyChartProps } from 'components';
import { MarketDetailsUi } from '.';

export default {
  title: 'Pages/MarketDetail',
  component: MarketDetailsUi,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof MarketDetailsUi>;

const totalBorrowBalanceCents = 100000000;
const borrowApyPercentage = 2.24;
const borrowDistributionApyPercentage = 1.1;
const totalSupplyBalanceCents = 100000000000;
const supplyApyPercentage = 4.56;
const supplyDistributionApyPercentage = 0.45;

const chartData: IApyChartProps['data'] = [
  {
    apyPercentage: 40,
    timestamp: new Date('2022-05-03T10:59:44.330Z'),
    balanceCents: new BigNumber(10000),
  },
  {
    apyPercentage: 30,
    timestamp: new Date('2022-05-04T10:59:44.330Z'),
    balanceCents: new BigNumber(10000000),
  },
  {
    apyPercentage: 20,
    timestamp: new Date('2022-05-05T10:59:44.330Z'),
    balanceCents: new BigNumber(100000),
  },
  {
    apyPercentage: 27,
    timestamp: new Date('2022-05-06T10:59:44.330Z'),
    balanceCents: new BigNumber(100000),
  },
  {
    apyPercentage: 18,
    timestamp: new Date('2022-05-07T10:59:44.330Z'),
    balanceCents: new BigNumber(10000000000),
  },
  {
    apyPercentage: 23,
    timestamp: new Date('2022-05-08T10:59:44.330Z'),
    balanceCents: new BigNumber(10000000),
  },
  {
    apyPercentage: 34,
    timestamp: new Date('2022-05-09T10:59:44.330Z'),
    balanceCents: new BigNumber(100000),
  },
];

export const Default = () => (
  <MarketDetailsUi
    totalBorrowBalanceCents={totalBorrowBalanceCents}
    borrowApyPercentage={borrowApyPercentage}
    borrowDistributionApyPercentage={borrowDistributionApyPercentage}
    totalSupplyBalanceCents={totalSupplyBalanceCents}
    supplyApyPercentage={supplyApyPercentage}
    supplyDistributionApyPercentage={supplyDistributionApyPercentage}
    supplyChartData={chartData}
    borrowChartData={chartData}
  />
);
