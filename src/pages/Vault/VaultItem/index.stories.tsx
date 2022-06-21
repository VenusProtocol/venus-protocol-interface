import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { VaultItemUi } from '.';

export default {
  title: 'Pages/Vault/VaultItem',
  component: VaultItemUi,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as ComponentMeta<typeof VaultItemUi>;

export const Default = () => (
  <VaultItemUi
    stakedTokenId="vai"
    rewardTokenId="xvs"
    userPendingRewardWei={new BigNumber(0)}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaimReward={noop}
    onStake={noop}
    onWithdraw={noop}
    closeActiveModal={noop}
    isClaimRewardLoading={false}
  />
);

export const WithPendingReward = () => (
  <VaultItemUi
    stakedTokenId="vrt"
    rewardTokenId="vrt"
    userPendingRewardWei={new BigNumber('900000000000000')}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaimReward={noop}
    onStake={noop}
    onWithdraw={noop}
    closeActiveModal={noop}
    isClaimRewardLoading={false}
  />
);
