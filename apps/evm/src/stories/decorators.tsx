import Box from '@mui/material/Box';
import type { StoryFn } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider } from 'theme/MuiThemeProvider';

export const withRouter = (Story: StoryFn) => (
  <BrowserRouter>
    <Story />
  </BrowserRouter>
);

export const withThemeProvider = (Story: StoryFn) => (
  <MuiThemeProvider>
    <Story />
  </MuiThemeProvider>
);

export const withCenterStory: (props: {
  width?: number | string;
  height?: number | string;
}) => unknown = props => {
  const { width, height } = props;

  return (Story: StoryFn) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Box sx={{ flexShrink: 0, maxWidth: width, width: '100%', height }}>
        <Story />
      </Box>
    </Box>
  );
};
