import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { ApyChartProps } from 'components';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { withRouter } from 'stories/decorators';

import { MarketUi } from '.';

const fakeApyChartData: ApyChartProps['data'] = [
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
  title: 'Pages/MarketDetail',
  component: MarketUi,
  decorators: [withRouter],
} as Meta<typeof MarketUi>;

export const Default = () => (
  <MarketUi
    asset={assetData[0]}
    supplyChartData={fakeApyChartData}
    borrowChartData={fakeApyChartData}
    interestRateChartData={vTokenApySimulations}
    poolComptrollerAddress={poolData[0].comptrollerAddress}
    isChartDataLoading={false}
    isInterestRateChartDataLoading={false}
  />
);
