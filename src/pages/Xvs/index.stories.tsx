import { Meta } from '@storybook/react';

import { withRouter } from 'stories/decorators';

import Xvs from '.';

export default {
  title: 'Pages/Xvs',
  component: Xvs,
  decorators: [withRouter],
} as Meta<typeof Xvs>;

export { Xvs };
