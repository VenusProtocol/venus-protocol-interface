import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { TOKENS } from 'constants/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

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
} as Meta<typeof Vai>;

const Template: StoryFn<VaiProps> = props => <Vai {...props} />;

const context: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  isConnected: true,
  accountAddress: fakeAddress,
};

export const Disconnected = Template.bind({});

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withApprovedToken({
    token: TOKENS.vai,
    accountAddress: fakeAddress,
    spenderAddress: getContractAddress('vaiController'),
  }),
];
