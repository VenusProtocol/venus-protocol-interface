import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import VoterLeaderboard from '.';

export default {
  title: 'Pages/VoterLeaderboard',
  component: VoterLeaderboard,
  decorators: [withRouter, withProvider],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof VoterLeaderboard>;

const Template: Story = args => <VoterLeaderboard {...args} />;

export const Page = Template.bind({});
