import type { Preview } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@venusprotocol/ui';
import { BrowserRouter } from 'react-router';
import { MuiThemeProvider } from '../src/App/MuiThemeProvider';
import { queryClient } from '../src/clients/api/queryClient';
import initializeLibraries from '../src/initializeLibraries';
import { AnalyticProvider } from '../src/libs/analytics';
import { Web3Wrapper } from '../src/libs/wallet';

import '../src/assets/styles/index.css';

initializeLibraries();

const preview: Preview = {
  decorators: [
    Story => (
      <BrowserRouter>
        <MuiThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Web3Wrapper>
              <AnalyticProvider>
                <div style={{ padding: '40px' }}>
                  <Story />
                </div>
              </AnalyticProvider>
            </Web3Wrapper>
          </QueryClientProvider>
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
