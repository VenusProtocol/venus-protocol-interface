import React from 'react';
import { ComponentMeta } from '@storybook/react';
import noop from 'noop-ts';

import { withCenterStory } from 'stories/decorators';
import { Connector } from 'clients/web3';
import { AuthModal } from '.';

export default {
  title: 'Components/AuthModal',
  component: AuthModal,
  decorators: [withCenterStory({ width: 800 })],
} as ComponentMeta<typeof AuthModal>;

export const Default = () => (
  <AuthModal isOpen onClose={noop} onLogOut={noop} onLogin={noop} onCopyAccountAddress={noop} />
);

export const WithAccount = () => (
  <AuthModal
    isOpen
    onClose={noop}
    onLogOut={noop}
    onLogin={noop}
    onCopyAccountAddress={noop}
    account={{
      address: '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
      connector: Connector.MetaMask,
    }}
  />
);
