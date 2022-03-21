import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import { Sidebar } from '.';

export default {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Sidebar>;

export const SidebarDefault = () => <Sidebar />;
