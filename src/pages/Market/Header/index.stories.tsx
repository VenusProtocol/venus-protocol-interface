import React from 'react';
import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import { withRouter, withProvider, withCenterStory } from 'stories/decorators';
import Header from '.';

export default {
  title: 'Pages/Market/Header',
  component: Header,
  decorators: [withRouter, withProvider, withCenterStory({ width: '100%' })],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Header>;

export const Default = () => (
  <Header
    totalSupplyCents={new BigNumber('912902278.25')}
    totalBorrowCents={new BigNumber('912902278.25')}
    availableLiquidityCents={new BigNumber('912902278.25')}
    totalTreasuryCents={new BigNumber('912902278.25')}
  />
);
