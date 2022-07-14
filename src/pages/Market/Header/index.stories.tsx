import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import { HeaderUi } from '.';

export default {
  title: 'Pages/Market/Header',
  component: HeaderUi,
  decorators: [withRouter, withCenterStory({ width: '100%' })],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof HeaderUi>;

export const Default = () => (
  <HeaderUi
    totalSupplyCents={new BigNumber('912902278.25')}
    totalBorrowCents={new BigNumber('912902278.25')}
    availableLiquidityCents={new BigNumber('912902278.25')}
    totalTreasuryCents={new BigNumber('912902278.25')}
  />
);
