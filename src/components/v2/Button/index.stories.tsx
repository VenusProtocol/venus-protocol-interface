import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { PrimaryButton, SecondaryButton, TertiaryButton, TextButton, Button } from '.';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [withThemeProvider, withCenterStory({ width: 250 })],
} as ComponentMeta<typeof Button>;

export const Primary = () => <PrimaryButton onClick={console.log} label="Primary" />;
export const Secondary = () => <SecondaryButton onClick={console.log} label="Secondary" />;
export const Tertiary = () => <TertiaryButton onClick={console.log} label="Tertiary" />;
export const Text = () => <TextButton onClick={console.log} label="Text" />;

export const Small = () => <PrimaryButton onClick={console.log} label="Small" small />;
export const FullWidth = () => <PrimaryButton onClick={console.log} fullWidth label="Full width" />;
export const Disabled = () => <PrimaryButton onClick={console.log} disabled label="Disabled" />;
export const Loading = () => <PrimaryButton onClick={console.log} loading label="Loading" />;
Loading.story = {
  parameters: {
    loki: { skip: true },
  },
};
