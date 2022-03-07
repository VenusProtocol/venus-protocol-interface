import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Box from '@mui/material/Box';
import { withThemeProvider } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { Tooltip } from '.';

export default {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Tooltip>;

export const TooltipDefault = () => (
  <Box p={10}>
    <Tooltip title="hello from tooltip">
      <Typography display="inline-flex">Hello from storybook</Typography>
    </Tooltip>
  </Box>
);
