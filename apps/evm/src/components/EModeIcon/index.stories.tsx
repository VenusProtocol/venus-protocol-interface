import type { Meta, StoryObj } from '@storybook/react';

import { EModeIcon } from '.';

const meta = {
  title: 'Components/EModeIcon',
  component: EModeIcon,
} satisfies Meta<typeof EModeIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Isolated: Story = {
  args: {
    isIsolated: true,
  },
};
