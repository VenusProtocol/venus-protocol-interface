import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
} from 'stories/decorators';
import Transaction from '.';

export default {
  title: 'Transaction',
  component: Transaction,
  decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof Transaction>;

export { Transaction };
