import type { Meta, StoryObj } from '@storybook/react';

import { Username } from '.';

const meta = {
  title: 'Components/Username',
  component: Username,
  args: {
    address: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
  },
} satisfies Meta<typeof Username>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCopyAddress: Story = {
  args: {
    showCopyAddress: true,
  },
};

export const FullAddress: Story = {
  args: {
    shouldEllipseAddress: false,
  },
};
