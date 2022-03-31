import React from 'react';
import BigNumber from 'bignumber.js';

import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { BorrowMarketUi, BorrowAsset } from '.';

const borrowAssets: BorrowAsset[] = [
  {
    id: 'xvs',
    name: 'XVS',
    walletBalanceCoins: new BigNumber(100),
    borrowApyPercentage: 3.14,
    liquidityCents: new BigNumber('1269738581100'),
  },
  {
    id: 'usdc',
    name: 'USDC',
    walletBalanceCoins: new BigNumber(0),
    borrowApyPercentage: 0.15,
    liquidityCents: new BigNumber('874776312719632'),
  },
  {
    id: 'bnb',
    name: 'BNB',
    walletBalanceCoins: new BigNumber(23126378213),
    borrowApyPercentage: 2.14,
    liquidityCents: new BigNumber('12673572112321328768'),
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
