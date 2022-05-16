import { ComponentMeta } from '@storybook/react';
import { withRouter, withProvider } from 'stories/decorators';
import Xvs from '.';

export default {
  title: 'Pages/Xvs',
  component: Xvs,
  decorators: [withRouter, withProvider],
} as ComponentMeta<typeof Xvs>;

export { Xvs };
