import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import { TESTNET_TOKENS } from 'constants/tokens';
import { withCenterStory } from 'stories/decorators';

import { WalletData } from '.';

export default {
  title: 'Components/WalletData',
  component: WalletData,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof WalletData>;

export const Default = () => (
  <WalletData
    onRevoke={noop}
    walletBalanceTokens={new BigNumber('100000')}
    walletSpendingLimitTokens={new BigNumber('1000000')}
    token={TESTNET_TOKENS.xvs}
  />
);

export const CoversWalletBalance = () => (
  <WalletData
    onRevoke={noop}
    walletBalanceTokens={new BigNumber('100000')}
    walletSpendingLimitTokens={new BigNumber('100000')}
    token={TESTNET_TOKENS.xvs}
  />
);
