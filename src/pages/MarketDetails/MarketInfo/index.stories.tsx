import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import MarketInfo from '.';

export default {
  title: 'Pages/MarketDetail/MarketInfo',
  component: MarketInfo,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof MarketInfo>;

export { MarketInfo };
