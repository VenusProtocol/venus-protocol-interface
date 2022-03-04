import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { TextField } from '.';

export default {
  title: 'Components/TextField',
  component: TextField,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TextField>;

export const Default = () => <TextField />;

export const WithLabel = () => <TextField label="Label" />;

export const WithDescription = () => <TextField description="This is a fake description" />;

export const WithLeftIcon = () => <TextField leftIconName="xvs" />;

export const WithRightButton = () => (
  <TextField
    rightButtonProps={{
      label: 'Safe max',
    }}
  />
);

export const WithHasError = () => <TextField label="Label" hasError />;
