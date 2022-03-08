import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Toggle } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Toggle>;

export const Default = () => <Toggle onChange={console.log} />;
