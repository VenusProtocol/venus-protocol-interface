import { Meta } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { AuthContextValue } from 'context/AuthContext';
import { withAuthContext, withRouter, withThemeProvider } from 'stories/decorators';

import { SidebarUi } from '.';

const context: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  accountAddress: fakeAddress,
};

export default {
  title: 'Components/Layout/Sidebar',
  component: SidebarUi,
  decorators: [withThemeProvider, withRouter, withAuthContext(context)],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof SidebarUi>;

export const SidebarDefault = () => (
  <MemoryRouter initialEntries={['/dashboard']}>
    <Route component={SidebarUi} path="/dashboard" />
  </MemoryRouter>
);
