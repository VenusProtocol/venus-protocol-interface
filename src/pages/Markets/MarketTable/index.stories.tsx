import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { markets } from '__mocks__/models/markets';
import { withRouter } from 'stories/decorators';

import { MarketTableProps, MarketTableUi } from '.';

export default {
  title: 'Pages/Market/MarketTable',
  component: MarketTableUi,
  decorators: [withRouter],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof MarketTableUi>;

const Template: Story<MarketTableProps> = args => <MarketTableUi {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  markets,
};
