import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { VTokenId } from 'types';
import { getVBepToken } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

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
    address: fakeAddress,
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
  asset: assetData[0],
  onClose: noop,
};

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withEnabledToken({
    tokenId: assetData[0].id,
    accountAddress: fakeAddress,
    spenderAddress: getVBepToken(assetData[0].id as VTokenId).address,
  }),
];
Default.args = {
  asset: assetData[0],
  onClose: noop,
};
