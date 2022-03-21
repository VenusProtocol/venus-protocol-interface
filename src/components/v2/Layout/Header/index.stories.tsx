import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { Header } from '.';

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Header>;

export const HeaderDefault = () => <Header pageTitle="Hello from storybook" />;
