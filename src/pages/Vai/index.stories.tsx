import { ComponentMeta, Story } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { TOKENS } from 'constants/tokens';
import { withAuthContext, withCenterStory, withEnabledToken } from 'stories/decorators';

import Vai, { VaiProps } from '.';

export default {
  title: 'Pages/Dashboard/Vai',
  component: Vai,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof Vai>;

const Template: Story<VaiProps> = props => <Vai {...props} />;

const context = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isReconnecting: false,
  accountAddress: fakeAddress,
};

export const Disconnected = Template.bind({});

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withEnabledToken({
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiController'),
  }),
];
