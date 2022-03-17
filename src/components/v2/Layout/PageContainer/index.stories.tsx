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
import { PageContainer } from '.';

export default {
  title: 'Components/Layout/PageContainer',
  component: PageContainer,
  decorators: [
    withRouter,
    withProvider,
    withWeb3Provider,
    withMarketContext,
    withVaiContext,
    withThemeProvider,
  ],
} as ComponentMeta<typeof PageContainer>;

export const PageContainerDefault = () => (
  <PageContainer currentBlockNumber={123456789}>Hello from storybook</PageContainer>
);
