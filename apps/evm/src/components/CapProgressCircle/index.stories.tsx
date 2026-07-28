import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { usdc } from '__mocks__/models/tokens';
import { CapProgressCircle } from '.';

const meta = {
  title: 'Components/CapProgressCircle',
  component: CapProgressCircle,
  args: {
    token: usdc,
    title: 'Supply cap',
    tokenPriceCents: new BigNumber(100),
    limitTokens: new BigNumber(1000000),
    valueTokens: new BigNumber(420000),
  },
} satisfies Meta<typeof CapProgressCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTooltip: Story = {
  args: {
    tooltip: 'This is a fake cap tooltip',
  },
};
