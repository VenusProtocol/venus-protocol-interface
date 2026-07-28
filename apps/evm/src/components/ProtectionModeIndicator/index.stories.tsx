import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { ProtectionModeIndicator } from '.';

const meta = {
  title: 'Components/ProtectionModeIndicator',
  component: ProtectionModeIndicator,
  args: {
    tokenName: 'USDC',
    tokenSupplyPriceCents: new BigNumber(100),
    tokenBorrowPriceCents: new BigNumber(98),
  },
} satisfies Meta<typeof ProtectionModeIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Icon: Story = {};

export const Label: Story = {
  args: {
    variant: 'label',
  },
};

export const SupplyTooltip: Story = {
  args: {
    tooltipType: 'supply',
    userSupplyBalanceCents: new BigNumber(100000),
  },
};
