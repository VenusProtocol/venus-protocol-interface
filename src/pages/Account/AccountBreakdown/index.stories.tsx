import { Meta } from '@storybook/react';
import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import { withRouter } from 'stories/decorators';

import { AccountUi } from '.';

export default {
  title: 'Pages/Account',
  component: AccountUi,
  decorators: [withRouter],
} as Meta<typeof AccountUi>;

export const WhileFetchingPools = () => <AccountUi pools={poolData} vaults={vaults} isFetching />;

export const Default = () => <AccountUi pools={poolData} vaults={vaults} />;
