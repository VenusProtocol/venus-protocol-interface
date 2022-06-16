import React from 'react';
import BigNumber from 'bignumber.js';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import NonVestingVaultActionModal, { INonVestingVaultActionModalProps } from '.';

export default {
  title: 'Pages/Vault/modals/NonVestingVaultActionModal',
  component: NonVestingVaultActionModal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof NonVestingVaultActionModal>;

const Template: Story<INonVestingVaultActionModalProps> = args => (
  <NonVestingVaultActionModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: 'Stake VAI',
  tokenId: 'vai',
  availableTokensWei: new BigNumber('193871256231321312312'),
  availableTokensLabel: 'Available VAI',
  submitButtonLabel: 'Stake',
  submitButtonDisabledLabel: 'Enter a valid amount to stake',
};
