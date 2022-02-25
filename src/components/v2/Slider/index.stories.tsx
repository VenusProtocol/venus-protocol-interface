import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import Box from '@mui/material/Box';
import { Slider } from '.';

export default {
  title: 'Slider',
  component: Slider,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Slider>;

export const ValidDropdown = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
    }}
  >
    <Box sx={{ width: 600, display: 'flex' }}>
      <Slider
        onChange={console.log}
        defaultValue={50}
        step={10}
        mark={75}
        ariaLabel="Storybook slider"
        min={0}
        max={100}
      />
    </Box>
  </Box>
);

export const InValidDropdown = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
    }}
  >
    <Box sx={{ width: 600, display: 'flex' }}>
      <Slider
        onChange={console.log}
        defaultValue={90}
        step={10}
        mark={75}
        ariaLabel="Storybook slider"
        min={0}
        max={100}
      />
    </Box>
  </Box>
);
