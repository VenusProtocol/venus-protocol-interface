import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import MintRepayVai, { MintRepayVaiProps } from '.';

export default {
  title: 'Pages/Dashboard/MintRepayVai',
  component: MintRepayVai,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MintRepayVai>;

const Template: Story<MintRepayVaiProps> = props => <MintRepayVai {...props} />;

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

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withEnabledToken({
    tokenId: 'vai',
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiUnitroller'),
  }),
];
