import { ComponentMeta } from '@storybook/react';

import { withRouter } from 'stories/decorators';

import Account from '.';

export default {
  title: 'Pages/Account',
  component: Account,
  decorators: [withRouter],
} as ComponentMeta<typeof Account>;

export { Account };
