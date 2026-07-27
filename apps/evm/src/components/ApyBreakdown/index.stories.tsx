import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { usdc, xvs } from '__mocks__/models/tokens';
import { ApyBreakdown } from '.';

const items = [
  {
    type: 'supply' as const,
    token: usdc,
    baseApyPercentage: new BigNumber('3.42'),
    tokenDistributions: [
      {
        type: 'venus' as const,
        token: xvs,
        apyPercentage: new BigNumber('1.2'),
        dailyDistributedTokens: new BigNumber('100'),
        isActive: true,
      },
    ],
  },
];

const meta = {
  title: 'Components/ApyBreakdown',
  component: ApyBreakdown,
  args: {
    items,
  },
} satisfies Meta<typeof ApyBreakdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accordion: Story = {
  args: {
    renderType: 'accordion',
  },
};
