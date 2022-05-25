import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withCenterStory } from 'stories/decorators';
import MintRepayVai from '.';

export default {
  title: 'Pages/Dashboard/MintRepayVai',
  component: MintRepayVai,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MintRepayVai>;

export const Default = () => <MintRepayVai />;
