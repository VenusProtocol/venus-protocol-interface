import { Meta } from '@storybook/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { withRouter, withThemeProvider } from 'stories/decorators';

import Header from '.';

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [withThemeProvider, withRouter],
} as Meta<typeof Header>;

export const HeaderDefault = () => (
  <div style={{ minHeight: 100 }}>
    <MemoryRouter initialEntries={['/dashboard']}>
      <Route component={Header} path="/dashboard" />
    </MemoryRouter>
  </div>
);
