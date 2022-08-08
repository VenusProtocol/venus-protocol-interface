import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { ApyChartProps } from 'components';
import React from 'react';

import { vTokenApySimulations } from '__mocks__/models/vTokenApySimulations';
import { withRouter } from 'stories/decorators';

import { MarketDetailsUi } from '.';

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
  component: MarketDetailsUi,
  decorators: [withRouter],
} as ComponentMeta<typeof MarketDetailsUi>;

export const Default = () => (
  <MarketDetailsUi
    vTokenId="bnb"
    totalBorrowBalanceCents={100000000}
    borrowApyPercentage={new BigNumber(2.24)}
    borrowDistributionApyPercentage={1.1}
    totalSupplyBalanceCents={100000000000}
    supplyApyPercentage={new BigNumber(4.56)}
    supplyDistributionApyPercentage={0.45}
    currentUtilizationRate={46}
    tokenPriceDollars={new BigNumber('1.14')}
    liquidityCents={new BigNumber(10000000000)}
    supplierCount={1234}
    borrowerCount={76}
    borrowCapTokens={new BigNumber(812963286)}
    dailyBorrowingInterestsCents={123212}
    dailySupplyingInterestsCents={123212}
    dailyDistributionXvs={new BigNumber(812963286)}
    reserveTokens={new BigNumber(100000)}
    reserveFactor={20}
    collateralFactor={70}
    mintedTokens={new BigNumber(10000000)}
    exchangeRateVTokens={new BigNumber(1.345)}
    supplyChartData={fakeApyChartData}
    borrowChartData={fakeApyChartData}
    interestRateChartData={vTokenApySimulations}
  />
);
