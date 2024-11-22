import type { Meta, StoryObj } from '@storybook/react';
import { xvs } from '__mocks__/models/tokens';

import BigNumber from 'bignumber.js';
import { ActiveVotingProgress } from '.';

export default {
  title: 'Components/ActiveVotingProgress',
  component: ActiveVotingProgress,
  args: {
    xvs,
    votedForMantissa: new BigNumber('100000000000000000000'),
    votedAgainstMantissa: new BigNumber('200000000000000000000'),
    abstainedMantissa: new BigNumber('300000000000000000000'),
  },
} as Meta<typeof ActiveVotingProgress>;

type Story = StoryObj<typeof ActiveVotingProgress>;

export const Default: Story = {};
