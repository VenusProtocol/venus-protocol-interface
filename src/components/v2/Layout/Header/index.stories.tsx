import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider, withMarketContext, withVaiContext } from 'stories/decorators';
import { Header } from '.';

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [withRouter, withProvider, withMarketContext, withVaiContext],
} as ComponentMeta<typeof Header>;

export const HeaderDefault = () => (
  <div style={{ minHeight: 100 }}>
    <Header pageTitle="Hello from storybook" />
  </div>
);
