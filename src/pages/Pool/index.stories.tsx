import { Meta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withRouter } from 'stories/decorators';

import { PoolUi } from '.';

export default {
  title: 'Pages/Pool',
  component: PoolUi,
  decorators: [withRouter],
} as Meta<typeof PoolUi>;

export const Default = () => <PoolUi pool={poolData[0]} />;
