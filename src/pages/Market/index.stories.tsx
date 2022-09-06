import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withRouter } from 'stories/decorators';

import Market from '.';

export default {
  title: 'Pages/Market',
  component: Market,
  decorators: [withRouter],
} as ComponentMeta<typeof Market>;

export const Default = () => <Market />;
