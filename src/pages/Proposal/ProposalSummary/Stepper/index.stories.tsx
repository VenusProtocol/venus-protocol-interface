import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import proposals from '__mocks__/models/proposals';
import Stepper, { IStepperProps } from '.';

export default {
  title: 'Pages/Proposal/Components/Stepper',
  component: Stepper,
  decorators: [withCenterStory({ width: 400 })],
} as ComponentMeta<typeof Stepper>;

const Template: Story<IStepperProps> = (args: IStepperProps) => <Stepper {...args} />;

export const Pending = Template.bind({});
Pending.args = {
  proposal: {
    ...proposals[0],
    state: 'Pending',
    startDate: undefined,
    executedDate: undefined,
    endDate: new Date(1654000000700),
    queuedDate: undefined,
  },
};

export const Active = Template.bind({});
Active.args = {
  proposal: {
    ...proposals[0],
    state: 'Active',
    executedDate: undefined,
    endDate: new Date(1654000009000),
    queuedDate: undefined,
  },
};

export const Defeated = Template.bind({});
Defeated.args = {
  proposal: { ...proposals[0], state: 'Defeated', executedDate: undefined, queuedDate: undefined },
};

export const Succeeded = Template.bind({});
Succeeded.args = {
  proposal: { ...proposals[0], state: 'Succeeded', executedDate: undefined, queuedDate: undefined },
};

export const Canceled = Template.bind({});
Canceled.args = {
  proposal: {
    ...proposals[0],
    state: 'Canceled',
    cancelDate: new Date(1654005000700),
    executedDate: undefined,
    queuedDate: undefined,
  },
};

export const Expired = Template.bind({});
Expired.args = {
  proposal: { ...proposals[0], state: 'Expired', executedDate: undefined, queuedDate: undefined },
};

export const Queued = Template.bind({});
Queued.args = {
  proposal: { ...proposals[0], state: 'Queued', executedDate: undefined },
};

export const Executed = Template.bind({});
Executed.args = {
  proposal: { ...proposals[0], state: 'Executed' },
};
