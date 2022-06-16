import React from 'react';
import noop from 'noop-ts';

import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import NonVestingVaultStakeModal, { NonVestingVaultStakeModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/NonVestingVaultStakeModal',
  component: NonVestingVaultStakeModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof NonVestingVaultStakeModal>;

const Template: Story<NonVestingVaultStakeModalProps> = args => (
  <NonVestingVaultStakeModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tokenId: 'vai',
  handleClose: noop,
};
