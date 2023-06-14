import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withRouter } from 'stories/decorators';

import MarketInfo, { MarketInfoProps } from '.';

export default {
  title: 'Pages/MarketDetail/MarketInfo',
  component: MarketInfo,
  decorators: [withRouter, withCenterStory({ width: 400 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof MarketInfo>;

const stats: MarketInfoProps['stats'] = [
  {
    label: 'Fake stat 1',
    value: '100%',
  },
  {
    label: 'Fake stat 2',
    value: 1000000,
  },
];

export const Default = () => <MarketInfo stats={stats} />;
