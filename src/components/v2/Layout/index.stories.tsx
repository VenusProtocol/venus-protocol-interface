import React from 'react';
import { ComponentMeta } from '@storybook/react';
import {
  withRouter,
  withProvider,
  withWeb3Provider,
  withMarketContext,
  withVaiContext,
  withThemeProvider,
} from 'stories/decorators';
import { Layout } from '.';

export default {
  title: 'Components/Layout/Layout',
  component: Layout,
  decorators: [
    withRouter,
    withProvider,
    withWeb3Provider,
    withMarketContext,
    withVaiContext,
    withThemeProvider,
  ],
} as ComponentMeta<typeof Layout>;

export const LayoutDefault = () => <Layout>Hello from storybook</Layout>;
