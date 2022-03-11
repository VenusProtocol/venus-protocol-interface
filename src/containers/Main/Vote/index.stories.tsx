import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
} from 'stories/decorators';
import Vote from '.';

export default {
  title: 'Pages/Vote',
  component: Vote,
  decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof Vote>;

export { Vote };
