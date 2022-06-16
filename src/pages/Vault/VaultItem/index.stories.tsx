import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { VaultItem } from '.';

export default {
  title: 'Pages/Vault/VaultItem',
  component: VaultItem,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as ComponentMeta<typeof VaultItem>;

export const VaultItemDefault = () => (
  <VaultItem
    stakedTokenId="vai"
    rewardTokenId="xvs"
    userPendingRewardWei={new BigNumber('900000000000000')}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaim={noop}
    onStake={noop}
    onReward={noop}
  />
);

export const VaultItemWithoutReward = () => (
  <VaultItem
    stakedTokenId="vrt"
    rewardTokenId="vrt"
    userPendingRewardWei={new BigNumber(0)}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaim={noop}
    onStake={noop}
    onReward={noop}
  />
);
