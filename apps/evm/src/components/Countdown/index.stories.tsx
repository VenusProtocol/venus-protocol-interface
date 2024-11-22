import type { Meta, StoryObj } from '@storybook/react';

import { Countdown } from '.';

export default {
  title: 'Components/Countdown',
  component: Countdown,
  args: {
    date: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2),
  },
} as Meta<typeof Countdown>;

type Story = StoryObj<typeof Countdown>;

export const Default: Story = {};
