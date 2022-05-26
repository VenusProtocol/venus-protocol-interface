import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { VaultItemUi } from '.';

export default {
  title: 'Components/VaultItemUi',
  component: VaultItemUi,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as ComponentMeta<typeof VaultItemUi>;

export const VaultItemUiDefault = () => (
  <VaultItemUi
    tokenId="vai"
    rewardTokenId="xvs"
    rewardWei={new BigNumber('000900000000000000')}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaim={noop}
    onStake={noop}
    onReward={noop}
  />
);

export const VaultItemUiWithoutReward = () => (
  <VaultItemUi
    tokenId="vrt"
    rewardTokenId="vrt"
    rewardWei={new BigNumber(0)}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onClaim={noop}
    onStake={noop}
    onReward={noop}
  />
);
