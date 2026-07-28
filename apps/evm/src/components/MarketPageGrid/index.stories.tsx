import type { Meta, StoryObj } from '@storybook/react';

import { Card } from 'components/Card';
import { MarketPageGrid } from '.';

const meta = {
  title: 'Components/MarketPageGrid',
  component: MarketPageGrid,
  args: {
    form: <Card className="h-80">Form content</Card>,
    content: <Card className="h-120">Main content</Card>,
  },
} satisfies Meta<typeof MarketPageGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
