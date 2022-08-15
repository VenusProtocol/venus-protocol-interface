import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { withCenterStory } from 'stories/decorators';

import { BorrowMarketUi } from '.';

export default {
  title: 'Pages/Dashboard/BorrowMarket',
  component: BorrowMarketUi,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowMarketUi>;

export const Default = () => (
  <BorrowMarketUi
    borrowMarketAssets={assetData}
    isXvsEnabled={false}
    hasLunaOrUstCollateralEnabled={false}
    openLunaUstWarningModal={noop}
  />
);
