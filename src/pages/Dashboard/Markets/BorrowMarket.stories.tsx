import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { BorrowMarketUi } from './BorrowMarket';
import { assetData } from './mocks';

export default {
  title: 'Components/BorrowMarket',
  component: BorrowMarketUi,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowMarketUi>;

export const Default = () => <BorrowMarketUi borrowAssets={assetData} withXVS={false} />;
