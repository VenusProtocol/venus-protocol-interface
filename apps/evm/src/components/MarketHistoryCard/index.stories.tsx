import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import { usdc } from '__mocks__/models/tokens';
import { MarketHistoryCard } from '.';

const historyData = [
  { blockTimestamp: 1704067200000, supplyApyPercentage: 2.2, totalSupplyCents: 100000000 },
  { blockTimestamp: 1706745600000, supplyApyPercentage: 3.1, totalSupplyCents: 120000000 },
  { blockTimestamp: 1709251200000, supplyApyPercentage: 2.8, totalSupplyCents: 115000000 },
];

const meta = {
  title: 'Components/MarketHistoryCard',
  component: MarketHistoryCard,
  args: {
    title: 'Supply market',
    cells: [
      { label: 'Liquidity', value: '$520K' },
      { label: 'Suppliers', value: '1,245' },
    ],
    cap: {
      token: usdc,
      title: 'Supply cap',
      tokenPriceCents: new BigNumber(100),
      limitTokens: new BigNumber(1000000),
      valueTokens: new BigNumber(420000),
    },
  },
} satisfies Meta<typeof MarketHistoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHistory: Story = {
  args: {
    history: {
      type: 'supply',
      data: historyData,
      isLoading: false,
      selectedPeriod: 'month',
      setSelectedPeriod: noop,
      periodOptions: [
        { label: '1M', value: 'month' },
        { label: '6M', value: 'halfyear' },
        { label: '1Y', value: 'year' },
      ],
    },
  },
};
