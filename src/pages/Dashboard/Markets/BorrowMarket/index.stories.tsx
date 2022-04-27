import React from 'react';
import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { assetData } from '__mocks__/models/asset';
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
    borrowingAssets={assetData}
    borrowMarketAssets={assetData}
    isXvsEnabled={false}
    userTotalBorrowLimit={new BigNumber(111)}
  />
);
