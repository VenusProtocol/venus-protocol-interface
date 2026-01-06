import type { Preview } from '@storybook/react';
import { theme } from '@venusprotocol/ui';
import { BrowserRouter } from 'react-router';
import { MuiThemeProvider } from '../src/App/MuiThemeProvider';
import initializeLibraries from '../src/initializeLibraries';

import '../src/assets/styles/index.css';

initializeLibraries();

const preview: Preview = {
  decorators: [
    Story => (
      <BrowserRouter>
        <MuiThemeProvider>
          <div style={{ padding: '40px' }}>
            <Story />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'Default',
      values: [
        {
          name: 'Default',
          value: theme.colors.cards,
        },
        {
          name: 'Primary',
          value: theme.colors.background,
        },
        {
          name: 'White',
          value: theme.colors.white,
        },
      ],
    },
  },
};

export default preview;
