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
import { Header } from '.';

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [
    withRouter,
    withProvider,
    withWeb3Provider,
    withMarketContext,
    withVaiContext,
    withThemeProvider,
  ],
} as ComponentMeta<typeof Header>;

export const HeaderDefault = () => <Header pageTitle="Hello from storybook" />;
