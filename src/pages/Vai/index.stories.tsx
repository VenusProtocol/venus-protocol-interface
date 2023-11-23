import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import { getVaiControllerContractAddress } from 'packages/contracts';
import React from 'react';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import Vai, { VaiProps } from '.';

const VAI_CONTROLLER_CONTRACT_ADDRESS = getVaiControllerContractAddress({
  chainId: ChainId.BSC_TESTNET,
})!;

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
  switchChain: noop,
  chainId: ChainId.BSC_TESTNET,
  accountAddress: fakeAddress,
};

export const Disconnected = Template.bind({});

export const Disabled = Template.bind({});
Disabled.decorators = [withAuthContext(context)];

export const Default = Template.bind({});
Default.decorators = [
  withAuthContext(context),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];
