import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Dashboard from '.';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  decorators: [withRouter, withProvider],
  parameters: {
    // @TODO: remove once all requests relevant to the page have been mocked
    // (see https://app.clickup.com/t/26b2m5p)
    loki: { skip: true },
  },
} as ComponentMeta<typeof Dashboard>;

export { Dashboard };
