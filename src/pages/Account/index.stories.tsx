import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { withRouter } from 'stories/decorators';

import { AccountUi } from '.';

export default {
  title: 'Pages/Account',
  component: AccountUi,
  decorators: [withRouter],
} as ComponentMeta<typeof AccountUi>;

export const WhileFetchingPools = () => <AccountUi pools={poolData} isFetchingPools />;

export const Default = () => <AccountUi pools={poolData} />;
