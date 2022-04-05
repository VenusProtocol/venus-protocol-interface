import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { MintRepayVai } from '.';

export default {
  title: 'Components/Dashboard/MintRepayVai',
  component: MintRepayVai,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MintRepayVai>;

export const Default = () => <MintRepayVai />;
