import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import { usdc } from '__mocks__/models/tokens';
import { MarketHistoryCard } from '.';

const historyData = [
  { timestampMs: 1704067200000, apyPercentage: 2.2, balanceCents: new BigNumber(100000000) },
  { timestampMs: 1706745600000, apyPercentage: 3.1, balanceCents: new BigNumber(120000000) },
  { timestampMs: 1709251200000, apyPercentage: 2.8, balanceCents: new BigNumber(115000000) },
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
