import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router';
import { withThemeProvider, withRouter, withProvider } from 'stories/decorators';
import Header from '.';

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [withThemeProvider, withRouter, withProvider],
} as ComponentMeta<typeof Header>;

export const HeaderDefault = () => (
  <div style={{ minHeight: 100 }}>
    <MemoryRouter initialEntries={['/dashboard']}>
      <Route component={Header} path="/dashboard" />
    </MemoryRouter>
  </div>
);
