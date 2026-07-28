import type { Meta, StoryObj } from '@storybook/react';

import { assetData } from '__mocks__/models/asset';
import { AssetApy } from '.';

const meta = {
  title: 'Components/AssetApy',
  component: AssetApy,
  args: {
    asset: assetData[0],
    type: 'supply',
  },
} satisfies Meta<typeof AssetApy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Supply: Story = {};

export const Borrow: Story = {
  args: {
    type: 'borrow',
  },
};
