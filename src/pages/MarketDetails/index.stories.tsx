import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import MarketDetail from '.';

export default {
  title: 'Pages/MarketDetail',
  component: MarketDetail,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof MarketDetail>;

export { MarketDetail };
