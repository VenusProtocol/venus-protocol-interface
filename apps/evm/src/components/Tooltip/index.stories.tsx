import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from '.';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    children: 'Content',
    title: 'Title',
    placement: 'top',
  },
} as Meta<typeof Tooltip>;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
