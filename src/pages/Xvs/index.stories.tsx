import { ComponentMeta } from '@storybook/react';

import { withRouter } from 'stories/decorators';

import Xvs from '.';

export default {
  title: 'Pages/Xvs',
  component: Xvs,
  decorators: [withRouter],
} as ComponentMeta<typeof Xvs>;

export { Xvs };
