import type { Meta, StoryObj } from '@storybook/react';
import noop from 'noop-ts';

import { ApprovalSteps } from '.';

export default {
  title: 'Components/ApprovalSteps',
  component: ApprovalSteps,
  args: {
    showApprovalSteps: true,
    isApprovalActionLoading: false,
    firstStepLabel: 'First step label',
    firstStepButtonLabel: 'First step button label',
    firstStepTooltip: 'First step tooltip',
    secondStepLabel: 'Second step label',
    secondStepButtonLabel: 'Second step button label',
    children: 'Content',
    approvalAction: noop,
  },
} as Meta<typeof ApprovalSteps>;

type Story = StoryObj<typeof ApprovalSteps>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isApprovalActionLoading: true,
  },
};

export const WithoutTooltip: Story = {
  args: {
    firstStepTooltip: undefined,
  },
};

export const Content: Story = {
  args: {
    showApprovalSteps: false,
  },
};
