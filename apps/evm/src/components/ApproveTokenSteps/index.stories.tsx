import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { xvs } from '__mocks__/models/tokens';
import { ApproveTokenSteps } from '.';

export default {
  title: 'Components/ApproveTokenSteps',
  component: ApproveTokenSteps,
  args: {
    isTokenApproved: false,
    isWalletSpendingLimitLoading: false,
    isApproveTokenLoading: false,
    isUsingSwap: false,
    hideTokenEnablingStep: false,
    secondStepButtonLabel: 'Second step button label',
    token: xvs,
    children: 'Content',
    approveToken: noop,
  },
} as Meta<typeof ApproveTokenSteps>;

type Story = StoryObj<typeof ApproveTokenSteps>;

export const Default: Story = {};
