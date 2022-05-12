import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
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

export const Default = () => (
  <MarketDetailsUi
    totalBorrowBalanceCents={totalBorrowBalanceCents}
    borrowApyPercentage={borrowApyPercentage}
    borrowDistributionApyPercentage={borrowDistributionApyPercentage}
    totalSupplyBalanceCents={totalSupplyBalanceCents}
    supplyApyPercentage={supplyApyPercentage}
    supplyDistributionApyPercentage={supplyDistributionApyPercentage}
  />
);
