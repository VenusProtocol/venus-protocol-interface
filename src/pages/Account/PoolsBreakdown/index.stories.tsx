import { Meta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withCenterStory } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import PoolBreakdown from '.';

export default {
  title: 'Pages/Account/PoolBreakdown',
  component: PoolBreakdown,
  decorators: [withCenterStory({ width: 1200 })],
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as Meta<typeof PoolBreakdown>;

export const Default = () => <PoolBreakdown pools={poolData} />;
