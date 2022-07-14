import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { withRouter } from 'stories/decorators';

import VoterLeaderboard from '.';

export default {
  title: 'Pages/VoterLeaderboard',
  component: VoterLeaderboard,
  decorators: [withRouter],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof VoterLeaderboard>;

const Template: Story = args => <VoterLeaderboard {...args} />;

export const Page = Template.bind({});
