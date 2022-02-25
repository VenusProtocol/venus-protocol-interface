import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
} from 'stories/decorators';
import XVS from '.';

export default {
  title: 'Pages/XVS',
  component: XVS,
  decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof XVS>;

export { XVS };
