import type { Meta, StoryObj } from '@storybook/react';

import { AccordionAnimatedContent } from '.';

export default {
  title: 'Components/AccordionAnimatedContent',
  component: AccordionAnimatedContent,
  args: {
    isOpen: true,
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce viverra varius egestas. Etiam cursus pellentesque varius. Fusce cursus ac velit non volutpat. Ut elit nisi, malesuada tristique gravida in, eleifend vitae dui.',
  },
} as Meta<typeof AccordionAnimatedContent>;

type Story = StoryObj<typeof AccordionAnimatedContent>;

export const Default: Story = {};
