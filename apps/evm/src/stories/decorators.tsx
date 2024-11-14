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

export const withPadding = (Story: StoryFn) => (
  <div className="p-20">
    <Story />
  </div>
);
