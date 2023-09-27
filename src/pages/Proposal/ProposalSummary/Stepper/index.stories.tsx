import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { ProposalState } from 'types';

import proposals from '__mocks__/models/proposals';
import { withCenterStory } from 'stories/decorators';

import Stepper, { StepperProps } from '.';

export default {
  title: 'Pages/Proposal/Components/Stepper',
  component: Stepper,
  decorators: [withCenterStory({ width: 400 })],
} as Meta<typeof Stepper>;

const Template: StoryFn<StepperProps> = (args: StepperProps) => <Stepper {...args} />;

export const Pending = Template.bind({});
Pending.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Pending,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000000700),
  queuedDate: undefined,
};

export const Active = Template.bind({});
Active.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Active,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Defeated = Template.bind({});
Defeated.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Active,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Succeeded = Template.bind({});
Succeeded.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Active,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Canceled = Template.bind({});
Canceled.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Canceled,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Expired = Template.bind({});
Expired.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Expired,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Queued = Template.bind({});
Queued.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Queued,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};

export const Executed = Template.bind({});
Executed.args = {
  createdDate: proposals[0].createdDate,
  cancelDate: undefined,
  state: ProposalState.Executed,
  startDate: undefined,
  executedDate: undefined,
  endDate: new Date(1654000009000),
  queuedDate: undefined,
};
