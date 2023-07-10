import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeProvider from '__mocks__/models/provider';
import { TESTNET_VBEP_TOKENS } from 'constants/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import OperationModal, { OperationModalProps } from '.';

export default {
  title: 'Components/OperationModal',
  component: OperationModal,
  decorators: [withCenterStory({ width: 600 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as Meta<typeof OperationModal>;

const Template: StoryFn<OperationModalProps> = args => <OperationModal {...args} />;

const context: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  accountAddress: fakeAddress,
};

export const Disconnected = Template.bind({});
Disconnected.args = {
  vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
  onClose: noop,
};

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];
Disabled.args = {
  vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
  onClose: noop,
};

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withApprovedToken({
    token: assetData[0].vToken.underlyingToken,
    accountAddress: fakeAddress,
    spenderAddress: assetData[0].vToken.underlyingToken.address,
  }),
];
Default.args = {
  vToken: TESTNET_VBEP_TOKENS['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
  onClose: noop,
};
