import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withRouter } from 'stories/decorators';

import { PoolTableProps, PoolTableUi } from '.';

export default {
  title: 'Pages/Market/MarketTable',
  component: PoolTableUi,
  decorators: [withRouter],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof PoolTableUi>;

const Template: StoryFn<PoolTableProps> = args => <PoolTableUi {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  pools: poolData,
};
