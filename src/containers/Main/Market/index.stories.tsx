import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
} from 'stories/decorators';
import Market from '.';

export default {
  title: 'Market',
  component: Market,
  decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof Market>;

export { Market };
