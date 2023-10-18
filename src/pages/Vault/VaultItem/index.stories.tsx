import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import { vai, xvs } from '__mocks__/models/tokens';
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
} as Meta<typeof VaultItemUi>;

export const Default = () => (
  <VaultItemUi
    stakedToken={vai}
    rewardToken={xvs}
    userStakedWei={new BigNumber('100000000000000000000')}
    stakingAprPercentage={2.39}
    dailyEmissionWei={new BigNumber('2120000000000000000')}
    totalStakedWei={new BigNumber('1233000000000000000000')}
    onStake={noop}
    onWithdraw={noop}
    closeActiveModal={noop}
  />
);
