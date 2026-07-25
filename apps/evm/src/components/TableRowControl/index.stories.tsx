import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { TableRowControl } from '.';

const meta = {
  title: 'Components/TableRowControl',
  component: TableRowControl,
  args: {
    onClick: noop,
  },
} satisfies Meta<typeof TableRowControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
