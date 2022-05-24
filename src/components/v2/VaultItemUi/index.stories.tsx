import React from 'react';
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
    stakeTokenName="vai"
    earnTokenName="xvs"
    rewardValue={22.889}
    stakingValue={100}
    stakingAprValue={2.39}
    dailyEmissionValue={250}
    totalStakedValue={50100314}
    onClaim={console.log}
    onStake={console.log}
    onReward={console.log}
  />
);

export const VaultItemUiWithoutReward = () => (
  <VaultItemUi
    stakeTokenName="vrt"
    earnTokenName="vrt"
    rewardValue={-22.889}
    stakingValue={100}
    stakingAprValue={2.39}
    dailyEmissionValue={250}
    totalStakedValue={50100314}
    onClaim={console.log}
    onStake={console.log}
    onReward={console.log}
  />
);
