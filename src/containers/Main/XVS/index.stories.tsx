import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import XVS from '.';

export default {
  title: 'Pages/XVS',
  component: XVS,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof XVS>;

export { XVS };
