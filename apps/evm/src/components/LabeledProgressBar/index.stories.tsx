import type { Meta, StoryObj } from '@storybook/react';

import { LabeledProgressBar } from '.';

export default {
  title: 'Components/ProgressBar/LabeledProgressBar',
  component: LabeledProgressBar,
  args: {
    greyLeftText: 'Max:',
    whiteLeftText: '$5000',
    greyRightText: 'Minimum:',
    whiteRightText: '$100',
    progressBars: [{ value: 50 }],
    marks: [{ value: 75 }],
    min: 0,
    max: 100,
  },
} as Meta<typeof LabeledProgressBar>;

type Story = StoryObj<typeof LabeledProgressBar>;

export const Default: Story = {};

export const WithTooltips: Story = {
  args: {
    leftInfoTooltip: 'Left tooltip',
    rightInfoTooltip: 'Right tooltip',
  },
};

export const LeftOnly: Story = {
  args: {
    greyRightText: undefined,
    whiteRightText: undefined,
  },
};

export const MultiProgressBars: Story = {
  args: {
    progressBars: [{ value: 75, className: 'bg-red' }, { value: 35 }],
    marks: [{ value: 25 }, { value: 90, className: 'bg-white' }],
  },
};
