import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider, withCenterStory } from 'stories/decorators';
import MarketInfo, { IMarketInfoProps } from '.';

export default {
  title: 'Pages/MarketDetail/MarketInfo',
  component: MarketInfo,
  decorators: [withRouter, withProvider, withCenterStory({ width: 400 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MarketInfo>;

const stats: IMarketInfoProps['stats'] = [
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
