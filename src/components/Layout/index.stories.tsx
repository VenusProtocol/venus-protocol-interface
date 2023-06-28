import { Meta } from '@storybook/react';
import React from 'react';

import { withRouter, withThemeProvider } from 'stories/decorators';

import { Layout } from '.';

export default {
  title: 'Components/Layout/Layout',
  component: Layout,
  decorators: [withRouter, withThemeProvider],
} as Meta<typeof Layout>;

export const LayoutDefault = () => <Layout>Hello from storybook</Layout>;
