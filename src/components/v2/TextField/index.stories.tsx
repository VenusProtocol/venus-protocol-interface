import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { TextField } from '.';

export default {
  title: 'TextField',
  component: TextField,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as ComponentMeta<typeof TextField>;

export const DefaultTextField = () => <TextField />;

export const WithLeftIcon = () => <TextField leftIconName="xvs" />;

export const WithLabelTextField = () => <TextField label="Label" />;

export const WithLabelAndDescriptionTextField = () => (
  <TextField label="Label" description="This is a fake description" />
);

export const WithHasError = () => (
  <TextField label="Label" description="This is a fake description" hasError />
);
