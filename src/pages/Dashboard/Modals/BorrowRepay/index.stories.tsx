import React from 'react';
import noop from 'noop-ts';
import { ComponentMeta, Story } from '@storybook/react';
import { withCenterStory, withAuthContext } from 'stories/decorators';
import { assetData } from '__mocks__/models/asset';
import BorrowRepay, { IBorrowRepayProps } from '.';

export default {
  title: 'Pages/Dashboard/Modals/BorrowRepay',
  component: BorrowRepay,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof BorrowRepay>;

const Template: Story<IBorrowRepayProps> = args => <BorrowRepay {...args} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const Disconnected = Template.bind({});
Disconnected.args = {
  asset: assetData[0],
  onClose: noop,
};

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];
Disabled.args = {
  asset: { ...assetData[0], isEnabled: false },
  onClose: noop,
};

export const Default = Template.bind({});
Default.decorators = [withAuthContext(context)];
Default.args = {
  asset: assetData[0],
  onClose: noop,
};
