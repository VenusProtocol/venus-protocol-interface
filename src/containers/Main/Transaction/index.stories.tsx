import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Transaction from '.';

export default {
  title: 'Pages/Transaction',
  component: Transaction,
  decorators: [withRouter, withProvider],
  parameters: {
    // @TODO: remove once all requests relevant to the page have been mocked
    // (see https://app.clickup.com/t/26b2m5p)
    loki: { skip: true },
  },
} as ComponentMeta<typeof Transaction>;

export { Transaction };
