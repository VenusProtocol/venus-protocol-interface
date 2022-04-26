import React from 'react';
import noop from 'noop-ts';

import { Story, ComponentMeta } from '@storybook/react';
import { assetData } from '__mocks__/models/asset';
import { withCenterStory, withAuthContext } from 'stories/decorators';
import Borrow, { IBorrowProps } from '.';

export default {
  title: 'Pages/Dashboard/Modals/BorrowRepay/Borrow',
  component: Borrow,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof Borrow>;

const Template: Story<IBorrowProps> = args => <Borrow {...args} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  account: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

export const Default = Template.bind({});
Default.decorators = [withAuthContext(context)];
Default.args = {
  asset: assetData[0],
};

export const Disconnected = Template.bind({});
Disconnected.args = {
  asset: assetData[0],
};

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];
Disabled.args = {
  asset: { ...assetData[0], isEnabled: false },
};
