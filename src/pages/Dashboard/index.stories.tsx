import { ComponentMeta } from '@storybook/react';

import { withRouter } from 'stories/decorators';

import Dashboard from '.';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  decorators: [withRouter],
} as ComponentMeta<typeof Dashboard>;

export { Dashboard };
