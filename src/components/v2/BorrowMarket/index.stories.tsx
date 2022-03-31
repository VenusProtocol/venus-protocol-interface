import React from 'react';
import BigNumber from 'bignumber.js';

import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { BorrowMarketUi, BorrowAsset } from '.';

const borrowAssets: BorrowAsset[] = [
  {
    id: 'xvs',
    name: 'XVS',
    borrowApyPercentage: 3.14,
    liquidityCents: new BigNumber(12697385811),
  },
  {
    id: 'usdc',
    name: 'USDC',
    borrowApyPercentage: 0.15,
    liquidityCents: new BigNumber(874776312),
  },
  {
    id: 'bnb',
    name: 'BNB',
    borrowApyPercentage: 2.14,
    liquidityCents: new BigNumber(126735721),
  },
];

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

export const Default = () => <BorrowMarketUi borrowAssets={borrowAssets} />;
