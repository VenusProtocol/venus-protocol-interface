import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Transaction from '.';

export default {
  title: 'Pages/Transaction',
  component: Transaction,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Transaction>;

export { Transaction };
