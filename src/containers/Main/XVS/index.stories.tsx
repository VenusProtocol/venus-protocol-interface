import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import XVS from '.';

export default {
  title: 'Pages/XVS',
  component: XVS,
  decorators: [withRouter, withProvider],
  parameters: {
    // @TODO: remove once all requests relevant to the page have been mocked
    // (see https://app.clickup.com/t/26b2m5p)
    loki: { skip: true },
  },
} as ComponentMeta<typeof XVS>;

export { XVS };
