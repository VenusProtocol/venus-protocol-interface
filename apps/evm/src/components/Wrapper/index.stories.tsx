import type { Meta, StoryObj } from '@storybook/react';

import { Wrapper } from '.';

const meta = {
  title: 'Components/Wrapper',
  component: Wrapper,
  args: {
    children: <div className="rounded-lg bg-dark-blue p-6">Wrapped content</div>,
  },
} satisfies Meta<typeof Wrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
