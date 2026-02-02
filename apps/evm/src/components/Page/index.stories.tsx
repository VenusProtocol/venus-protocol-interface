import type { Meta, StoryObj } from '@storybook/react';

import { Page } from '.';

export default {
  title: 'Components/Page',
  component: Page,
  args: {
    indexWithSearchEngines: true,
    children: 'Content',
  },
} as Meta<typeof Page>;

type Story = StoryObj<typeof Page>;

export const Default: Story = {};
