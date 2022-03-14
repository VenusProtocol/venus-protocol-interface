import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { PrimaryButton, SecondaryButton, TextButton, Button } from '.';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withThemeProvider, withCenterStory({ width: 150 })],
} as ComponentMeta<typeof Button>;

export const Primary = () => <PrimaryButton onClick={console.log}>Primary</PrimaryButton>;

export const Loading = () => (
  <PrimaryButton onClick={console.log} loading>
    Loading
  </PrimaryButton>
);
Loading.story = {
  parameters: {
    loki: { skip: true },
  },
};

export const Secondary = () => <SecondaryButton onClick={console.log}>Secondary</SecondaryButton>;

export const Text = () => <TextButton onClick={console.log}>Text</TextButton>;
