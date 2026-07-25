import type { Meta, StoryObj } from '@storybook/react';
import { theme } from '@venusprotocol/ui';

import { LabeledProgressCircle } from '.';

const meta = {
  title: 'Components/LabeledProgressCircle',
  component: LabeledProgressCircle,
  args: {
    value: 3,
    total: 5,
  },
} satisfies Meta<typeof LabeledProgressCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomFill: Story = {
  args: {
    fillColor: theme.colors.green,
  },
};
