import React from 'react';
import noop from 'noop-ts';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { SuccessModal, ISuccessModalProps } from '.';

export default {
  title: 'Pages/Dashboard/Modals/Success',
  component: SuccessModal,
  decorators: [withCenterStory({ width: 400 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof SuccessModal>;

const Template: Story<ISuccessModalProps> = args => <SuccessModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: noop,
  title: 'Supply successful',
  description: 'supplyWithdraw.successfullySupplied',
};
