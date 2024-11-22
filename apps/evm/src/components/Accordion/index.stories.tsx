import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '.';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    title: 'Title',
    rightLabel: 'Right label',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra varius egestas. Etiam cursus pellentesque varius. Fusce cursus ac velit non volutpat. Ut elit nisi, malesuada tristique gravida in, eleifend vitae dui.',
  },
} as Meta<typeof Accordion>;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};
