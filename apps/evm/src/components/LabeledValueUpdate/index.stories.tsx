import type { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { usdc } from '__mocks__/models/tokens';
import { LabeledValueUpdate } from '.';

const meta = {
  title: 'Components/LabeledValueUpdate',
  component: LabeledValueUpdate,
  args: {
    label: 'Supply balance',
    iconSrc: usdc,
    original: '1,000',
    update: '1,250',
    deltaAmountCents: new BigNumber(25000),
  },
} satisfies Meta<typeof LabeledValueUpdate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Increase: Story = {};

export const Decrease: Story = {
  args: {
    original: '1,250',
    update: '1,000',
    deltaAmountCents: new BigNumber(-25000),
  },
};
