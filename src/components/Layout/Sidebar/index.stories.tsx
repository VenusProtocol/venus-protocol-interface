import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withRouter, withProvider } from 'stories/decorators';
import { MemoryRouter, Route } from 'react-router';
import { SidebarUi } from '.';

export default {
  title: 'Components/Layout/Sidebar',
  component: SidebarUi,
  decorators: [withThemeProvider, withRouter, withProvider],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SidebarUi>;

export const SidebarDefault = () => (
  <MemoryRouter initialEntries={['/dashboard']}>
    <Route component={SidebarUi} path="/dashboard" />
  </MemoryRouter>
);
