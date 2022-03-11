import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
} from 'stories/decorators';
import Dashboard from '.';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof Dashboard>;

export { Dashboard };
