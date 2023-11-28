import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';

import { vai, xvs } from '__mocks__/models/tokens';

import { withCenterStory } from 'stories/decorators';

import StakeModal, { StakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/StakeModal',
  component: StakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof StakeModal>;

const Template: StoryFn<StakeModalProps> = args => <StakeModal {...args} />;

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  stakedToken: vai,
  rewardToken: xvs,
  handleClose: noop,
};
