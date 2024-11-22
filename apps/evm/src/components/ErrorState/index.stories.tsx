import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { ErrorState } from '.';

export default {
  title: 'Components/ErrorState',
  component: ErrorState,
  args: {
    message: 'Message',
    button: {
      label: 'Button',
      onClick: noop,
    },
  },
} as Meta<typeof ErrorState>;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};
