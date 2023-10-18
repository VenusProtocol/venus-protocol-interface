import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';

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
} as Meta<typeof HeaderUi>;

export const Default = () => (
  <HeaderUi
    treasurySupplyBalanceCents={new BigNumber(912902278)}
    treasuryBorrowBalanceCents={new BigNumber(912902278)}
    treasuryLiquidityBalanceCents={new BigNumber(912902278)}
    treasuryBalanceCents={new BigNumber(912902278)}
  />
);
