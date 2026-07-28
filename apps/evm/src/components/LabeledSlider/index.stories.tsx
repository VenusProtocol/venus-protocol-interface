import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { LabeledSlider } from '.';

const meta = {
  title: 'Components/LabeledSlider',
  component: LabeledSlider,
  args: {
    value: 42,
    onChange: noop,
  },
} satisfies Meta<typeof LabeledSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
