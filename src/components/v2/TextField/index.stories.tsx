import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { Button } from 'components';
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

export const WithRightAdornment = () => <TextField rightAdornment={<Button>Safe max</Button>} />;

export const WithHasError = () => <TextField label="Label" hasError />;
