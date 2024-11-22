import type { Meta, StoryObj } from '@storybook/react';

import { Pill } from '.';

export default {
  title: 'Components/Pill',
  component: Pill,
  args: {
    children: 'Content',
  },
} as Meta<typeof Pill>;

type Story = StoryObj<typeof Pill>;

export const Default: Story = {};
