import type { Meta, StoryObj } from '@storybook/react';

import { BodyBackdrop } from '.';

const meta = {
  title: 'Components/BodyBackdrop',
  component: BodyBackdrop,
  args: {
    className: 'absolute inset-auto h-40 w-72 rounded-lg bg-white/5',
  },
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} satisfies Meta<typeof BodyBackdrop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
