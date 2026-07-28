import type { Meta, StoryObj } from '@storybook/react';

import { IsolatedAssetIndicator } from '.';

const meta = {
  title: 'Components/IsolatedAssetIndicator',
  component: IsolatedAssetIndicator,
} satisfies Meta<typeof IsolatedAssetIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
