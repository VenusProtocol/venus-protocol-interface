import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { legacyCorePool } from '__mocks__/models/pools';
import { BalanceUpdates } from '.';

const meta = {
  title: 'Components/BalanceUpdates',
  component: BalanceUpdates,
  args: {
    pool: legacyCorePool,
    balanceMutations: [
      {
        type: 'asset',
        action: 'supply',
        vTokenAddress: legacyCorePool.assets[0].vToken.address,
        amountTokens: new BigNumber('10'),
      },
      {
        type: 'asset',
        action: 'borrow',
        vTokenAddress: legacyCorePool.assets[2].vToken.address,
        amountTokens: new BigNumber('5'),
      },
    ],
  },
} satisfies Meta<typeof BalanceUpdates>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    balanceMutations: [],
  },
};
