import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withRouter } from 'stories/decorators';
import { MemoryRouter, Route } from 'react-router';
import { SidebarUi } from '.';

export default {
  title: 'Components/Layout/Sidebar',
  component: SidebarUi,
  decorators: [withThemeProvider, withRouter],
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
