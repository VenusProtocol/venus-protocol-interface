import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider, withQueryClientProvider } from 'stories/decorators';
import { MintRepayVai } from '.';

export default {
  title: 'Pages/Dashboard/MintRepayVai',
  component: MintRepayVai,
  decorators: [withQueryClientProvider, withThemeProvider, withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MintRepayVai>;

// TODO: mock calls to contracts

export const Default = () => <MintRepayVai />;
