import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import { getVaiControllerContractAddress } from 'packages/contracts';
import React from 'react';
import { ChainId } from 'types';

import fakeAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { vai } from '__mocks__/models/tokens';
import { AuthContextValue } from 'context/AuthContext';
import { withApprovedToken, withAuthContext, withCenterStory } from 'stories/decorators';

import WithdrawFromVaiVaultModal, { WithdrawFromVaiVaultModalProps } from '.';

const VAI_CONTROLLER_CONTRACT_ADDRESS = getVaiControllerContractAddress({
  chainId: ChainId.BSC_TESTNET,
})!;

export default {
  title: 'Pages/Vault/modals/WithdrawFromVaiVaultModal',
  component: WithdrawFromVaiVaultModal,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof WithdrawFromVaiVaultModal>;

const Template: StoryFn<WithdrawFromVaiVaultModalProps> = args => (
  <WithdrawFromVaiVaultModal {...args} />
);

const authContext: AuthContextValue = {
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: fakeProvider,
  chainId: ChainId.BSC_TESTNET,
  isPrime: false,
  accountAddress: '0x0000000000000000000000000000000000000000',
};

export const Default = Template.bind({});
Default.args = {
  handleClose: noop,
};
Default.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];

export const WithoutConnectedAccount = Template.bind({});
WithoutConnectedAccount.args = {
  handleClose: noop,
};

export const WithDisabledToken = Template.bind({});
WithDisabledToken.args = {
  handleClose: noop,
};
WithDisabledToken.decorators = [withAuthContext(authContext)];

export const WithIsInitialLoading = Template.bind({});
WithIsInitialLoading.args = {
  handleClose: noop,
};
WithIsInitialLoading.decorators = [
  withAuthContext(authContext),
  withApprovedToken({
    token: vai,
    accountAddress: fakeAddress,
    spenderAddress: VAI_CONTROLLER_CONTRACT_ADDRESS,
  }),
];
