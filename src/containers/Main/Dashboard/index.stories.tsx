import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Dashboard from '.';

export default {
  title: 'Dashboard',
  component: Dashboard,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Dashboard>;

export { Dashboard };
