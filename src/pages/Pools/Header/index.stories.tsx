import { ComponentMeta } from '@storybook/react';
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
    treasurySupplyBalanceCents={912902278}
    treasuryBorrowBalanceCents={912902278}
    treasuryLiquidityBalanceCents={912902278}
    treasuryBalanceCents={912902278}
  />
);
