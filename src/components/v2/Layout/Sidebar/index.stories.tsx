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
import { Sidebar } from '.';

export default {
    title: 'Sidebar',
    component: Sidebar,
    decorators: [withRouter, withProvider, withWeb3Provider, withMarketContext, withVaiContext, withThemeProvider],
} as ComponentMeta<typeof Sidebar>;

export const SidebarDefault = () => <Sidebar />;
