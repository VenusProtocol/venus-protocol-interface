import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withThemeProvider } from 'stories/decorators';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Toggle } from '.';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [withRouter, withThemeProvider],
} as ComponentMeta<typeof Toggle>;

export const ToggleDefault = () => (
  <Box sx={{ width: '200px', m: 5, p: 5 }} component={Paper}>
    <Toggle onChange={console.log} />
  </Box>
);
