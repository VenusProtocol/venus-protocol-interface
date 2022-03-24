import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withRouter, withProvider } from 'stories/decorators';
import { MemoryRouter, Route } from 'react-router';
import { Sidebar } from '.';

export default {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  decorators: [withThemeProvider, withRouter, withProvider],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof Sidebar>;

export const SidebarDefault = () => (
  <MemoryRouter initialEntries={['/dashboard']}>
    <Route component={Sidebar} path="/dashboard" />
  </MemoryRouter>
);
