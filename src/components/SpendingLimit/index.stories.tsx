import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import { xvs } from '__mocks__/models/tokens';
import { withCenterStory } from 'stories/decorators';

import { SpendingLimit } from '.';

export default {
  title: 'Components/SpendingLimit',
  component: SpendingLimit,
  decorators: [withCenterStory({ width: 500 })],
} as Meta<typeof SpendingLimit>;

export const Default = () => (
  <SpendingLimit
    onRevoke={noop}
    walletBalanceTokens={new BigNumber('1000000')}
    walletSpendingLimitTokens={new BigNumber('100000')}
    isRevokeLoading={false}
    token={xvs}
  />
);

export const Loading = () => (
  <SpendingLimit
    onRevoke={noop}
    walletBalanceTokens={new BigNumber('1000000')}
    walletSpendingLimitTokens={new BigNumber('100000')}
    isRevokeLoading
    token={xvs}
  />
);

export const CoversWalletBalance = () => (
  <SpendingLimit
    onRevoke={noop}
    walletBalanceTokens={new BigNumber('100000')}
    walletSpendingLimitTokens={new BigNumber('100000')}
    isRevokeLoading={false}
    token={xvs}
  />
);
