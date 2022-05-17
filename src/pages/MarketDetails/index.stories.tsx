import React from 'react';
import BigNumber from 'bignumber.js';

import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { fakeApyChartData, fakeInterestRateChartData } from './__mocks__/models';
import { MarketDetailsUi } from '.';

export default {
  title: 'Pages/MarketDetail',
  component: MarketDetailsUi,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof MarketDetailsUi>;

export const Default = () => (
  <MarketDetailsUi
    vTokenId="bnb"
    totalBorrowBalanceCents={100000000}
    borrowApyPercentage={2.24}
    borrowDistributionApyPercentage={1.1}
    totalSupplyBalanceCents={100000000000}
    supplyApyPercentage={4.56}
    supplyDistributionApyPercentage={0.45}
    currentUtilizationRate={46}
    tokenPriceCents={114.15}
    marketLiquidityTokens={new BigNumber(100000000)}
    supplierCount={1234}
    borrowerCount={76}
    borrowCapCents={8129632.86}
    dailyInterestsCents={1232.12}
    reserveTokens={new BigNumber(100000)}
    reserveFactor={20}
    collateralFactor={70}
    mintedTokens={new BigNumber(10000000)}
    exchangeRateVToken={new BigNumber(1.345)}
    supplyChartData={fakeApyChartData}
    borrowChartData={fakeApyChartData}
    interestRateChartData={fakeInterestRateChartData}
  />
);
