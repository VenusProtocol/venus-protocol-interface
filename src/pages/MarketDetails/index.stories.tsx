import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { fakeApyChartData, fakeInterestRateChartData } from './mockData';
import { MarketDetailsUi } from '.';

export default {
  title: 'Pages/MarketDetail',
  component: MarketDetailsUi,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof MarketDetailsUi>;

export const Default = () => (
  <MarketDetailsUi
    totalBorrowBalanceCents={100000000}
    borrowApyPercentage={2.24}
    borrowDistributionApyPercentage={1.1}
    totalSupplyBalanceCents={100000000000}
    supplyApyPercentage={4.56}
    supplyDistributionApyPercentage={0.45}
    currentUtilizationRate={46}
    supplyChartData={fakeApyChartData}
    borrowChartData={fakeApyChartData}
    interestRateChartData={fakeInterestRateChartData}
  />
);
