import type { Meta, StoryObj } from '@storybook/react';

import { IsolatedEModeGroupTooltip } from '.';

const meta = {
  title: 'Components/IsolatedEModeGroupTooltip',
  component: IsolatedEModeGroupTooltip,
  args: {
    eModeGroupName: 'Stablecoins',
  },
} satisfies Meta<typeof IsolatedEModeGroupTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
