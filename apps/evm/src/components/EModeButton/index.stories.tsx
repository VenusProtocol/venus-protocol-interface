import type { Meta, StoryObj } from '@storybook/react';

import { EModeButton } from '.';

const meta = {
  title: 'Components/EModeButton',
  component: EModeButton,
  args: {
    poolComptrollerContractAddress: '0x94d1820b2d1c7c7452a163983dc888cec546b77d',
    analyticVariant: 'storybook',
    children: 'E-Mode',
    variant: 'secondary',
  },
} satisfies Meta<typeof EModeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
