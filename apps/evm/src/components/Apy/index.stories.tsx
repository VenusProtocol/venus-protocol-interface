import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { usdc, xvs } from '__mocks__/models/tokens';
import { Apy } from '.';

const meta = {
  title: 'Components/Apy',
  component: Apy,
  args: {
    type: 'supply',
    token: usdc,
    baseApyPercentage: new BigNumber('3.42'),
    tokenDistributions: [],
  },
} satisfies Meta<typeof Apy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Boosted: Story = {
  args: {
    tokenDistributions: [
      {
        type: 'venus',
        token: xvs,
        apyPercentage: new BigNumber('1.2'),
        dailyDistributedTokens: new BigNumber('100'),
        isActive: true,
      },
    ],
  },
};

export const Muted: Story = {
  args: {
    isMuted: true,
  },
};
