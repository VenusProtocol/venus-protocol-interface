import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { withCenterStory } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import MarketBreakdown from '.';

export default {
  title: 'Pages/Account/MarketBreakdown',
  component: MarketBreakdown,
  decorators: [withCenterStory({ width: 1200 })],
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as ComponentMeta<typeof MarketBreakdown>;

export const Default = () => (
  <MarketBreakdown assets={assetData} riskLevel="MINIMAL" marketName="Venus" />
);
