import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { withRouter, withThemeProvider } from 'stories/decorators';

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
